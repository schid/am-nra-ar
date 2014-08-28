<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="CMSImportDashboardControl.ascx.cs" Inherits="CMSImport.Dashboard.CMSImportDashboardControl" %>
<%@ Register Assembly="controls" Namespace="umbraco.uicontrols" TagPrefix="umbraco" %>
<asp:Panel runat="server" ID="CMSImportDashBoard">
<input type="hidden" id="submittrigger" runat="server" />
<umbraco:Feedback ID="ImportFeedback" runat="server" Visible="false"></umbraco:Feedback>
<asp:ValidationSummary ID="DashboardSummary" runat="server" ValidationGroup ="CMSImportDashboard" CssClass="error" />
<umbraco:Pane ID="StartImportPane" runat="server">
<asp:Literal ID="IntroLiteral" runat="server"></asp:Literal>
<asp:PlaceHolder ID="NoDefinitionsPlaceHolder" runat="server"><asp:Literal ID="NoDefinitionsLiteral" runat="server" /></asp:PlaceHolder>
</umbraco:Pane>
<umbraco:Pane ID="SelectDefinitionPane" runat="server"><umbraco:PropertyPanel ID="SelectImportDefinition"  runat="server">
	<asp:DropDownList ID="SelectImportDefinitionDropdownlist" runat="server" 
		AutoPostBack="true" CausesValidation="false" 
		onselectedindexchanged="SelectImportDefinitionDropdownlist_SelectedIndexChanged" /></umbraco:PropertyPanel></umbraco:Pane>
<umbraco:Pane ID="UploadFilePane" runat="server">
<umbraco:PropertyPanel ID="UploadFilePropertyPanel"  runat="server"><asp:FileUpload ID="DatasourceUpload" runat="server" /><asp:RequiredFieldValidator ID="DataSourceRequiredField" runat="server" ControlToValidate="DatasourceUpload" ErrorMessage="Datasource is required" Text="*"  ValidationGroup="CMSImportDashboard"/>
	<asp:CustomValidator ID="DataSourceValidator"  runat="server" 
		ControlToValidate="DatasourceUpload" 
		Text="*"  ValidationGroup="CMSImportDashboard" 
		onservervalidate="DataSourceValidator_ServerValidate" /></umbraco:PropertyPanel>
</umbraco:Pane>
<umbraco:Pane ID="UploadMediaPane" runat="server">
<umbraco:PropertyPanel ID="UploadMediaPanel" Text="Upload media" runat="server"><asp:FileUpload ID="MediaUpload" runat="server" /><asp:CustomValidator ID="MediaValidator"  runat="server" 
		ControlToValidate="DatasourceUpload"  
		Text="*"  ValidationGroup="CMSImportDashboard" 
		onservervalidate="MediaValidator_ServerValidate" /></umbraco:PropertyPanel>
</umbraco:Pane>
<umbraco:Pane ID="ActionPane" runat="server">
<umbraco:PropertyPanel ID="ActionPropertyPanel" Text="" runat="server">
	<asp:Button ID="ImportButton" runat="server" onclick="ImportButton_Click"  ValidationGroup="CMSImportDashboard" CssClass="btn btn-success" />&nbsp;&nbsp;&nbsp;
 </umbraco:PropertyPanel>
	</umbraco:Pane>
    </asp:Panel>
