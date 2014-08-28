<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="SelectMembertype.ascx.cs" Inherits="CMSImport.Controls.ImportSteps.MemberImport.SelectMembertype" %>
<%@ Register Assembly="controls" Namespace="umbraco.uicontrols" TagPrefix="umbraco" %>
<umbraco:Pane ID="MemberInfoPane" runat="server">
<umbraco:PropertyPanel ID="ImportMemberTypePropertyPanel" runat="server"><asp:DropDownList ID="MemberTypeDropdown" runat="server" AutoPostBack="True" CausesValidation="False"/></umbraco:PropertyPanel>
<umbraco:PropertyPanel ID="ImportAssignRolePropertyPanel" runat="server"><asp:CheckboxList ID="AssignRoleList" runat="server" /></umbraco:PropertyPanel>
</umbraco:Pane>

<umbraco:Pane ID="MemberActionsPane" runat="server">
<umbraco:PropertyPanel runat="server" ID="AutoApproveMemberPropertyPanel"></umbraco:PropertyPanel>    
<umbraco:PropertyPanel ID="ActionWhenMemberPropertyPanel" runat="server"><asp:DropDownList ID="ActionWhenMemberExistsDropdown" runat="server"/></umbraco:PropertyPanel>
<umbraco:PropertyPanel ID="AutogeneratepasswordPropertyPanel" runat="server"><asp:CheckBox ID="AutogeneratepasswordCheckbox" runat="server"/></umbraco:PropertyPanel>
<umbraco:PropertyPanel ID="SendUserCredentialsViaMailPropertyPanel" runat="server"><asp:CheckBox ID="SendUserCredentialsViaMailCheckbox" runat="server"/></umbraco:PropertyPanel>
</umbraco:Pane>
