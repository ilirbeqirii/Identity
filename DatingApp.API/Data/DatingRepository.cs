using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DatingRepository : IDatingRepository
    {
        public DataContext _context { get; }
        public DatingRepository(DataContext context)
        {
            this._context = context;
        }

        public void Add<T>(T entity) where T : class
        {
            this._context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            this._context.Remove(entity);
        }

        public async Task<User> GetUser(int id)
        {
            var user = await _context.Users.Include(c => c.Photos).FirstOrDefaultAsync(u => u.Id == id);
            return user;
        }

        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
            var users = this._context.Users.Include(x => x.Photos).OrderByDescending(c => c.LastActive).AsQueryable();

            users = users.Where(c => c.Id != userParams.UserId);
            users = users.Where(c => c.Gender == userParams.Gender);

            if (userParams.Likers)
            {
                var userLikers = await GetUserLikes(userParams.UserId, userParams.Likers);
                users = users.Where(c => userLikers.Contains(c.Id));
            }

            if (userParams.Likees)
            {
                var userLikees = await GetUserLikes(userParams.UserId, userParams.Likers);
                users = users.Where(c => userLikees.Contains(c.Id));
            }

            if (userParams.MinAge != 18 || userParams.MaxAge != 99)
            {
                var minDob = DateTime.Today.AddYears(-userParams.MaxAge - 1);
                var maxDob = DateTime.Today.AddYears(-userParams.MinAge);

                users = users.Where(c => c.DateOfBirth >= minDob && c.DateOfBirth <= maxDob);
            }

            if (string.IsNullOrEmpty(userParams.OrderBy))
            {
                switch (userParams.OrderBy)
                {
                    case "created":
                        users = users.OrderByDescending(c => c.Created);
                        break;
                    default:
                        users = users.OrderByDescending(c => c.LastActive);
                        break;
                }
            }

            return await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }
        public async Task<Photo> GetPhoto(int id)
        {
            var photo = await _context.Photos.FirstOrDefaultAsync(p => p.Id == id);
            return photo;
        }

        public async Task<Photo> GetMainPhotoForUser(int userId)
        {
            return await _context.Photos.Where(c => c.UserId == userId).FirstOrDefaultAsync(p => p.IsMain);
        }

        public async Task<bool> SaveAll()
        {
            return await this._context.SaveChangesAsync() > 0;
        }

        public async Task<Like> GetLike(int userId, int recipientId)
        {
            return await this._context.Likes.FirstOrDefaultAsync(c => c.LikerId == userId && c.LikeeId == recipientId);
        }

        private async Task<IEnumerable<int>> GetUserLikes(int id, bool likers)
        {
            var user = await _context.Users
                        .Include(c => c.Likees)
                        .Include(c => c.Likers)
                        .FirstOrDefaultAsync(c => c.Id == id);

            if (likers)
            {
                return user.Likers.Where(c => c.LikeeId == id).Select(c => c.LikerId);
            }
            else
            {
                return user.Likees.Where(c => c.LikerId == id).Select(c => c.LikeeId);
            }
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams)
        {
            var messages = _context.Messages.
                            Include(x => x.Sender).ThenInclude(x => x.Photos)
                            .Include(x => x.Recipient).ThenInclude(x => x.Photos)
                            .AsQueryable();

            switch (messageParams.MessageContainer)
            {
                case "Inbox":
                    messages = messages.Where(x => x.RecipientId == messageParams.UserId && x.RecipientDeleted == false);
                    break;
                case "Outbox":
                    messages = messages.Where(x => x.SenderId == messageParams.UserId && x.SenderDeleted == false);
                    break;
                default:
                    messages = messages.Where(x => x.RecipientId == messageParams.UserId && x.IsRead == false
                    && x.RecipientDeleted == false);
                    break;
            }

            messages = messages.OrderByDescending(x => x.MessageSent);
            return await PagedList<Message>.CreateAsync(messages,
                messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId)
        {
            var messages = await _context.Messages.
                            Include(x => x.Sender).ThenInclude(x => x.Photos)
                            .Include(x => x.Recipient).ThenInclude(x => x.Photos)
                            .Where(x => x.RecipientId == userId && x.SenderId == recipientId && x.RecipientDeleted == false
                                || x.RecipientId == recipientId && x.SenderId == userId && x.SenderDeleted == false)
                                .OrderByDescending(m => m.MessageSent)
                                .ToListAsync();
            
            return messages;
        }
    }
}