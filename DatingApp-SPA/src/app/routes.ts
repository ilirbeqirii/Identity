import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { MemberListComponent } from "./members/member-list/member-list.component";
import { MessagesComponent } from "./messages/messages.component";
import { ListsComponent } from "./lists/lists.component";
import { AuthGuard } from "./_guards/auth.guard";
import { MemberDetailsComponent } from "./members/member-details/member-details.component";
import { MemberDetailResolverService } from "./_resolvers/member-detail-resolver.service";
import { MemberListResolverService } from "./_resolvers/member-list-resolver.service.";
import { MemberEditComponent } from "./members/member-edit/member-edit.component";
import { MemberEditResolverService } from "./_resolvers/member-edit-resolver.service";
import { PreventUnsavedChangesGuard } from "./_guards/prevent-unsaved-changes.guard.";
import { ListsResolver } from "./_resolvers/lists.resolver";
import { MessageResolver } from "./_resolvers/messages.resolver";
import { AdminPanelComponent } from "./Admin/admin-panel/admin-panel.component";

export const appRoutes: Routes = [
  { path: "", component: HomeComponent },
  {
    path: "",
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: "members", component: MemberListComponent, resolve: { users: MemberListResolverService } },
      { path: "members/:id", component: MemberDetailsComponent, resolve: { user: MemberDetailResolverService } },
      { path: "member/edit", component: MemberEditComponent, resolve: { user: MemberEditResolverService }, canDeactivate: [PreventUnsavedChangesGuard] },
      { path: "messages", component: MessagesComponent, resolve: { messages: MessageResolver } },
      { path: "lists", component: ListsComponent, resolve: { users: ListsResolver } },
      { path: "admin", component: AdminPanelComponent, data: { roles: ['Admin', 'Moderator'] } }
    ]
  },
  { path: "**", redirectTo: "", pathMatch: "full" }
];
