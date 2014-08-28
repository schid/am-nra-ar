<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Wizard.aspx.cs" Trace="false" MasterPageFile="/umbraco/masterpages/umbracoPage.Master"
    Inherits="CMSImport.Pages.Wizard" %>
    <%@ Register Assembly="controls" Namespace="umbraco.uicontrols" TagPrefix="umbraco" %>
<%@ Register Src="../UserControls/CMSImport.ascx" TagName="Wizard"
    TagPrefix="CMSImport" %>
    <%@ Register Src="../UserControls/StateError.ascx" TagName="StateError"
    TagPrefix="CMSImport" %>
<%@ Register Assembly="controls" Namespace="umbraco.uicontrols" TagPrefix="cc1" %>
<asp:Content ID="Content1" ContentPlaceHolderID="body" runat="server">
    <cc1:UmbracoPanel ID="UmbracoPanel" runat="server">
   <umbraco:Feedback ID="ProEditionInfo" runat="server" />
            <asp:Panel runat="server" ID="CSSPanel">
            <asp:PlaceHolder ID="CMSImportPlaceHolder" runat="server">
                <CMSImport:StateError id="StateError" runat="server" />
                    <CMSImport:Wizard id="CMSImport" runat="server" />
            </asp:PlaceHolder>
            <asp:PlaceHolder ID="SaveStatePlaceholder" runat="server">
                <umbraco:Pane ID="SavePane" runat="server">
                    <asp:PlaceHolder runat="server" ID="LegacySaveHeaderPlaceHolder">
    <h2><asp:Literal ID="LegacySaveHeader" runat="server"/></h2>
</asp:PlaceHolder>
<asp:PlaceHolder runat="server" ID="SaveHeaderPlaceHolder">
    <h3><asp:Literal ID="SaveHeader" runat="server"/></h3>
</asp:PlaceHolder>
                   
                <asp:ValidationSummary ID="saveSummary" runat="server" ValidationGroup="SaveState" />
                <umbraco:PropertyPanel runat="server" ID="SaveOptionsPanel">
                    <asp:TextBox ID="SaveAsTextbox" ValidationGroup="SaveState" MaxLength="250" runat="server" /><asp:RequiredFieldValidator
                                ID="SaveAsNameValidator" ControlToValidate="SaveAsTextbox" ValidationGroup="SaveState"
                                runat="server" Text="*"></asp:RequiredFieldValidator>

                </umbraco:PropertyPanel>
                     </umbraco:Pane>
            </asp:PlaceHolder>
                </asp:Panel>
    </cc1:UmbracoPanel>
</asp:Content>
