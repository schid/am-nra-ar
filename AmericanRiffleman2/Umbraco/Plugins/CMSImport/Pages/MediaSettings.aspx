<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="MediaSettings.aspx.cs" MasterPageFile="/umbraco/masterpages/umbracoPage.Master" ValidateRequest="false" Inherits="CMSImport.Pages.MediaSettings" %>
<%@ Register Assembly="controls" Namespace="umbraco.uicontrols" TagPrefix="cc1" %>
<asp:Content ID="Content1" ContentPlaceHolderID="body" runat="server">
    <cc1:UmbracoPanel ID="UmbracoPanel" runat="server">
        <cc1:Pane ID="MediaSettingsPane" runat="server" Text="">
        <h3><asp:literal ID="AdditionalSettingsTitle" runat="server" /></h3>
            <p><asp:literal ID="AdditionalSettingsIntro" runat="server" /></p>
         <cc1:PropertyPanel ID="MediaImportDefaultExtensions" runat="server" Text="MediaImportDefaultExtensions"><asp:TextBox ID="ExtensionTextBox"  runat="server" Width="300" CssClass="guiInputText" />&nbsp;<asp:LinkButton OnClick="AddButton_Click" ID="AddButton" runat="server" /><br />
         <asp:PlaceHolder ID="MultiDropdownPlaceHolder" runat="server" />
          </cc1:PropertyPanel>
          </cc1:Pane>
          <cc1:Pane ID="Pane2" runat="server">
                   <cc1:PropertyPanel ID="MediaImportAllowedDomains" runat="server" Text="MediaImportAllowedDomains"><asp:TextBox ID="DomainTextBox"  runat="server" Width="300" CssClass="guiInputText" Text="http://" />&nbsp;<asp:LinkButton OnClick="AddDomainButton_Click" ID="AddDomainButton" runat="server" /><br />
         <asp:PlaceHolder ID="MultiDomainPlaceholder" runat="server" />
          </cc1:PropertyPanel>

        </cc1:Pane>
    </cc1:UmbracoPanel>
</asp:Content>
