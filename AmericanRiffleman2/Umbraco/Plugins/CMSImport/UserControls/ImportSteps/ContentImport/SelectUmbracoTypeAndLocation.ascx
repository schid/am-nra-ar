<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="SelectUmbracoTypeAndLocation.ascx.cs" Inherits="CMSImport.Controls.ImportSteps.ContentImport.SelectUmbracoTypeAndLocation" %>
<%@ Register Assembly="CMSImportLibrary" Namespace="CMSImportLibrary.UIControls" TagPrefix="CMSImport" %>
<%@ Register Assembly="controls" Namespace="umbraco.uicontrols" TagPrefix="umbraco" %>
<umbraco:Feedback ID="DocChangeFeedback" runat="server" Visible="false" type="notice" />
<umbraco:Pane ID="DocumentInfoPane" runat="server">
<umbraco:PropertyPanel ID="ImportLocationPropertyPanel" runat="server"><asp:PlaceHolder ID="PagePickerHolder" runat="server"></asp:PlaceHolder></umbraco:PropertyPanel>
<umbraco:PropertyPanel ID="ImportDocumentTypePropertyPanel" runat="server"><asp:DropDownList ID="DocumentTypeDropdown" runat="server" AutoPostBack="true" OnSelectedIndexChanged="DocumentTypeDropdown_Changed"/></umbraco:PropertyPanel>
<umbraco:PropertyPanel ID="ImportAutoPublishPropertyPanel" runat="server"><asp:CheckBox ID="AutoPublishCheckBox" runat="server" /></umbraco:PropertyPanel>
</umbraco:Pane>

<asp:PlaceHolder ID="contentExistsOptions" runat="server">
<umbraco:Pane ID="UpdateOptionsPane" runat="server">
<umbraco:PropertyPanel ID="UpdateContentPropertyPanel" runat="server"><asp:CheckBox Id="UpdateContentCheckbox" runat="server" AutoPostBack="true" CausesValidation="false"  oncheckedchanged="ControlState_Changed" /></umbraco:PropertyPanel>
<asp:PlaceHolder ID="UpdateOptionsPlaceholder" runat="server">
<umbraco:PropertyPanel ID="ActionWhenContentExistsPropertyPanel" runat="server"><asp:DropDownList ID="ContentMergeOptions" runat="server" AutoPostBack="true" OnSelectedIndexChanged="ControlState_Changed"/></umbraco:PropertyPanel>
<asp:PlaceHolder ID="DataKeyPlaceHolder" runat="server">
<umbraco:PropertyPanel ID="DataKeyPropertyPanel" runat="server"><asp:DropDownList ID="DataKeyDropwdown" runat="server"/></umbraco:PropertyPanel>
</asp:PlaceHolder>
</asp:PlaceHolder>
</umbraco:Pane>

</asp:PlaceHolder>
<umbraco:Pane ID="ParentPane" runat="server">
<umbraco:PropertyPanel ID="ParentPropertyPanel" runat="server"><asp:DropDownList ID="ParentColumnDropdown" runat="server"/></umbraco:PropertyPanel>
</umbraco:Pane>

<umbraco:Pane ID="RecursivePane" runat="server">
<umbraco:PropertyPanel ID="EnableRecursiveImportsPropertyPanel" runat="server"><asp:CheckBox Id="EnableRecursiveCheckbox" runat="server" AutoPostBack="true" CausesValidation="false"  oncheckedchanged="ControlState_Changed" /></umbraco:PropertyPanel>
<asp:PlaceHolder ID="EnableRecursivePlaceHolder" runat="server">
<umbraco:PropertyPanel ID="RecursiveImportKeyPropertyPanel" runat="server"><asp:DropDownList ID="RecursiveImportKeyDropdown" runat="server"/></umbraco:PropertyPanel>
</asp:PlaceHolder>
</umbraco:Pane>


