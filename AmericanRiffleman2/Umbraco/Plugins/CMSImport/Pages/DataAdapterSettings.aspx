<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="DataAdapterSettings.aspx.cs"  MasterPageFile="/umbraco/masterpages/umbracoPage.Master" Inherits="CMSImport.Pages.DataAdapterSettings" %>
<%@ Register Assembly="controls" Namespace="umbraco.uicontrols" TagPrefix="cc1" %>
<%@ Register src="../usercontrols/CMSImportInstaller.ascx" tagname="Settings" tagprefix="CMSImport" %>
<asp:Content ID="Content1" ContentPlaceHolderID="body" runat="server">
<cc1:UmbracoPanel ID="UmbracoPanel" runat="server">
<CMSImport:Settings ID="Settings" runat="server" />
</cc1:UmbracoPanel>
</asp:Content>
