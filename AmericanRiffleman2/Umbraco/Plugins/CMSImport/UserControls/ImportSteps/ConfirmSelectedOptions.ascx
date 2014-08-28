<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="ConfirmSelectedOptions.ascx.cs" Inherits="CMSImport.Controls.ImportSteps.ConfirmSelectedOptions" %>
<%@ Register Assembly="controls" Namespace="umbraco.uicontrols" TagPrefix="umbraco" %>
<umbraco:Feedback ID="StructureFreedBack" runat="server" />
<umbraco:Pane ID="ConfirmDatasourcePane" runat="server">
<umbraco:PropertyPanel Id="ConfirmDataSourceTypePropertyPanel" runat="server"><asp:Literal ID="DataSourceTypeValueLiteral" runat="server" /></umbraco:PropertyPanel>
<asp:PlaceHolder ID="DatasourcePlaceholder" runat="server">
<umbraco:PropertyPanel Id="DatasourcePropertyPanel" runat="server"><asp:Literal ID="DataSourceValueLiteral" runat="server" /></umbraco:PropertyPanel>
</asp:PlaceHolder>
<asp:PlaceHolder ID="DataCommandPlaceholder" runat="server">
<umbraco:PropertyPanel ID="ConfirmDataCommandPropertyPanel" runat="server"><asp:Literal ID="DataCommandValueLiteral" runat="server" /></umbraco:PropertyPanel>
</asp:PlaceHolder>
<asp:PlaceHolder ID="AdditionalParametersPlaceholder" runat="server">
<umbraco:PropertyPanel ID="ConfirmAdditionalParametersPropertyPanel" runat="server">
<asp:Repeater ID="DatasourceOptionsRepeater" runat="server" >
<ItemTemplate>
<%#Eval("key") %> = <%#Eval("value") %><br />
</ItemTemplate>
</asp:Repeater>
</umbraco:PropertyPanel>
</asp:PlaceHolder>
<asp:PlaceHolder ID="ContentSpecificOptions" runat="server" Visible="false">
<asp:PlaceHolder ID="DocumentLocationPlaceholder" runat="server" Visible="false"><umbraco:PropertyPanel ID="ConfirmDocumentLocationPropertyPanel" runat="server"><asp:Literal ID="DocumentLocationValueLiteral" runat="server" /></umbraco:PropertyPanel></asp:PlaceHolder>
<umbraco:PropertyPanel ID="ConfirmDocumentTypePropertyPanel" runat="server"><asp:Literal ID="DocumentTypeValueLiteral" runat="server" /></umbraco:PropertyPanel>
<umbraco:PropertyPanel ID="ConfirmAutoPublishPropertyPanel" runat="server"> <asp:Literal ID="AutoPublishValueLiteral" runat="server" /></umbraco:PropertyPanel>
</asp:PlaceHolder>
<asp:PlaceHolder ID="MemberSpecificOptions" runat="server" Visible="false">
<umbraco:PropertyPanel ID="ConfirmMembertypePropertyPanel" runat="server"><asp:Literal ID="ConfirmMembertypeValueLiteral" runat="server" /></umbraco:PropertyPanel>
<umbraco:PropertyPanel ID="ConfirmSelectedMemberRolesPropertyPanel" runat="server"><asp:Literal ID="ConfirmSelectedMemberRoleValuesLiteral" runat="server" /></umbraco:PropertyPanel>
<umbraco:PropertyPanel ID="ConfirmActionWhenMemberExistsPropertyPanel" runat="server"><asp:Literal ID="ConfirmActionWhenMemberExistsValueLiteral" runat="server" /></umbraco:PropertyPanel>
<umbraco:PropertyPanel ID="ConfirmAutogeneratepasswordPropertyPanel" runat="server"><asp:Literal ID="ConfirmAutogeneratepasswordValueLiteral" runat="server" /></umbraco:PropertyPanel>
<umbraco:PropertyPanel ID="ConfirmSendUserCredentialsViaMailPropertyPanel" runat="server"><asp:Literal ID="ConfirmSendUserCredentialsViaMailValueLiteral" runat="server" /></umbraco:PropertyPanel>
</asp:PlaceHolder>

<asp:PlaceHolder ID="UpdatePlaceHolder" runat="server" Visible="false">
<umbraco:PropertyPanel ID="UpdateOptionsTitlePropertyPanel" runat="server">&nbsp;</umbraco:PropertyPanel>
<umbraco:PropertyPanel ID="ConfirmWhenItemExistsPropertyPanel" runat="server"><asp:Literal ID="ConfirmWhenItemExistsValueLiteral" runat="server" /></umbraco:PropertyPanel>
<asp:PlaceHolder ID="ConfirmDataKeyPlaceholder" runat="server"><umbraco:PropertyPanel ID="ConfirmDataKeyPropertyPanel" runat="server"><asp:Literal ID="ConfirmDataKeyValueLiteral" runat="server" /></umbraco:PropertyPanel></asp:PlaceHolder>
</asp:PlaceHolder>

<asp:PlaceHolder ID="ChildImportSettingsPlaceholder" runat="server" Visible="false">
<umbraco:PropertyPanel ID="ConfirmParentRelationPanel" runat="server"><asp:Literal ID="ParentRelationLiteral" runat="server" /></umbraco:PropertyPanel>
</asp:PlaceHolder>

<asp:PlaceHolder ID="RecursiveOptionPlaceHolder" runat="server" Visible="false">
<umbraco:PropertyPanel ID="ConfirmRecursiveOptionPanel" runat="server"><asp:Literal ID="RecursiveOptionLiteral" runat="server" /></umbraco:PropertyPanel>
<umbraco:PropertyPanel ID="ConfirmRecursiveForeignkeyPanel" runat="server"><asp:Literal ID="RecursiveForeignkeyLiteral" runat="server" /></umbraco:PropertyPanel>
</asp:PlaceHolder>

</umbraco:Pane>

<umbraco:Pane ID="MappingPane" runat="server">
    <umbraco:PropertyPanel ID="ConfirmMappingPropertyPanel" runat="server">&nbsp;</umbraco:PropertyPanel>
<umbraco:PropertyPanel ID="MapDocumentPropertyPanel" runat="server"><asp:Literal ID="MapDatabaseColumnLiteral" runat="server" /></umbraco:PropertyPanel>
<asp:Repeater ID="MappingRepeater" runat="server" >
<ItemTemplate>
<umbraco:PropertyPanel ID="MappingIdPropertyPanel" runat="server" Text='<%#ParseFixedPropertyAlias(Eval("key")) %>'><%#Eval("value") %><%#GetAdvancedSettings(Eval("key").ToString())%></umbraco:PropertyPanel>
</ItemTemplate>
</asp:Repeater>
</umbraco:Pane>













