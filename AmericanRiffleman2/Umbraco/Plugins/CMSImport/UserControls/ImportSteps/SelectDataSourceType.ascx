﻿<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="SelectDataSourceType.ascx.cs" Inherits="CMSImport.Controls.ImportSteps.SelectDataSourceType" %>
<%@ Register Assembly="controls" Namespace="umbraco.uicontrols" TagPrefix="umbraco" %>
<umbraco:Pane ID="DatasourcePane" runat="server">
<umbraco:PropertyPanel ID="SelectDataSourceTypePropertyPanel" runat="server"><asp:ListBox ID="DataSourceTypeList" runat="server" Rows="1"/></umbraco:PropertyPanel>
<asp:PlaceHolder ID="ImportAsPlaceholder" runat="server">
<umbraco:PropertyPanel ID="SelectImportAsPropertyPanel" runat="server"><asp:ListBox ID="DataImportAsList" runat="server" Rows="1"/></umbraco:PropertyPanel>
</asp:PlaceHolder>

</umbraco:Pane>