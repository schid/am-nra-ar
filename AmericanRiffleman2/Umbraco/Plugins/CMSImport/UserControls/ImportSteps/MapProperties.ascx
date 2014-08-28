<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="MapProperties.ascx.cs" Inherits="CMSImport.Controls.ImportSteps.MapProperties" %>
<%@ Register Assembly="CMSImportLibrary" Namespace=" CMSImportLibrary.UIControls.ProperyMapping" TagPrefix="CMSImport" %>
<%@ Register Assembly="CMSImportLibrary" Namespace=" CMSImportLibrary.UIControls" TagPrefix="CMSImport" %>
<%@ Register Assembly="controls" Namespace="umbraco.uicontrols" TagPrefix="umbraco" %>
<%@ Register assembly="CMSImportLibrary" namespace="CMSImportLibrary.UIControls.ProperyMapping" tagprefix="cc1" %>
<!--generic props go here-->
<umbraco:Pane ID="MapGenericContentPropertiesPane" runat="server">
<umbraco:PropertyPanel ID="MapGenericContentPropertiesLiteral" runat="server">&nbsp;</umbraco:PropertyPanel>

<asp:PlaceHolder ID="MapGenericContentPropertiesPlaceHolder" runat="server" Visible="false">

<umbraco:PropertyPanel ID="MapNamePropertyPanel" runat="server"><CMSImport:CommandDropdownlist OnSelectedIndexChanged="ColumnDropdown_SelectedIndexChanged" ID="NodeNameDatasourceDropdown"   ondatabinding="ColumnDropdown_DataBinding" OnDataBound="ColumnDropdown_DataBound"  runat="server" /> <CMSImport:PropertyMapping id="nodeNameMapping" PropertEditorAlias="ec15c1e5-9d90-422a-aa52-4f7622c63bea" runat="server" /></umbraco:PropertyPanel>
<umbraco:PropertyPanel ID="MapPublishPropertyPanel" runat="server"><CMSImport:CommandDropdownlist ID="PublishDateDatasourceDropdown"  OnSelectedIndexChanged="ColumnDropdown_SelectedIndexChanged"   ondatabinding="ColumnDropdown_DataBinding"  OnDataBound="ColumnDropdown_DataBound" runat="server" /> <CMSImport:PropertyMapping id="publishDateMapping" PropertEditorAlias="b6fb1622-afa5-4bbf-a3cc-d9672a442222" runat="server" /></umbraco:PropertyPanel>
<umbraco:PropertyPanel ID="MapUnPublishPropertyPanel" runat="server"><CMSImport:CommandDropdownlist ID="UnPublishDateDatasourceDropdown"    OnSelectedIndexChanged="ColumnDropdown_SelectedIndexChanged" ondatabinding="ColumnDropdown_DataBinding"  OnDataBound="ColumnDropdown_DataBound" runat="server" /> <CMSImport:PropertyMapping id="expiredateMapping" PropertEditorAlias="b6fb1622-afa5-4bbf-a3cc-d9672a442222" runat="server" /></umbraco:PropertyPanel>
<asp:PlaceHolder runat="server" ID="CreateDatePlaceholder">
<umbraco:PropertyPanel ID="MapCreateDateTimePropertyPanel" runat="server"><CMSImport:CommandDropdownlist ID="CreateDateTimeDatasourceDropdown"    OnSelectedIndexChanged="ColumnDropdown_SelectedIndexChanged" ondatabinding="ColumnDropdown_DataBinding"  OnDataBound="ColumnDropdown_DataBound" runat="server" /> <CMSImport:PropertyMapping id="createDateMapping" PropertyAlias="createDate" PropertEditorAlias="b6fb1622-afa5-4bbf-a3cc-d9672a442222" runat="server" /></umbraco:PropertyPanel>
</asp:PlaceHolder>

</asp:PlaceHolder>
</umbraco:Pane>
<asp:PlaceHolder ID="MapGenericMemberPropertiesPlaceHolder" runat="server" Visible="false">
<umbraco:Pane ID="MapGenericMemberPropertiesPane" runat="server" >


<umbraco:PropertyPanel ID="NamePropertyPanel" runat="server"><CMSImport:CommandDropdownlist ID="NamePropertyDropdown"  ondatabinding="ColumnDropdown_DataBinding"  OnSelectedIndexChanged="ColumnDropdown_SelectedIndexChanged" OnDataBound="ColumnDropdown_DataBound" runat="server" /> <CMSImport:PropertyMapping id="nameMapping"  PropertEditorAlias="ec15c1e5-9d90-422a-aa52-4f7622c63bea"  runat="server" /></umbraco:PropertyPanel>
<umbraco:PropertyPanel ID="LoginPropertyPanel" runat="server"><CMSImport:CommandDropdownlist ID="LoginPropertyDropdown"    ondatabinding="ColumnDropdown_DataBinding"  OnSelectedIndexChanged="ColumnDropdown_SelectedIndexChanged" OnDataBound="ColumnDropdown_DataBound" runat="server" /> <CMSImport:PropertyMapping id="loginMapping"  PropertEditorAlias="ec15c1e5-9d90-422a-aa52-4f7622c63bea"  runat="server" /></umbraco:PropertyPanel>
<asp:PlaceHolder ID="PasswordVisiblePlaceHolder" runat="server">
<umbraco:PropertyPanel ID="PasswordPropertyPanel" runat="server"><CMSImport:CommandDropdownlist ID="PasswordPropertyDropdown" OnSelectedIndexChanged="ColumnDropdown_SelectedIndexChanged"  ondatabinding="ColumnDropdown_DataBinding" OnDataBound="ColumnDropdown_DataBound" runat="server" /> <CMSImport:PropertyMapping id="passwordMapping"  PropertEditorAlias="ec15c1e5-9d90-422a-aa52-4f7622c63bea"  runat="server" /></umbraco:PropertyPanel>
</asp:PlaceHolder>
<umbraco:PropertyPanel ID="EmailPropertyPanel" runat="server"><CMSImport:CommandDropdownlist ID="EmailPropertyDropdown"    ondatabinding="ColumnDropdown_DataBinding" OnSelectedIndexChanged="ColumnDropdown_SelectedIndexChanged" OnDataBound="ColumnDropdown_DataBound" runat="server" />  <CMSImport:PropertyMapping id="emailMapping"  PropertEditorAlias="ec15c1e5-9d90-422a-aa52-4f7622c63bea"  runat="server" /></umbraco:PropertyPanel>

</umbraco:Pane>
    </asp:PlaceHolder>
<!--Dynamic Data-->
<umbraco:Pane ID="MapDynamicPropertiesPane" runat="server">
<umbraco:PropertyPanel ID="MapDocumentPropertyPanel" runat="server"><asp:Literal ID="MapDatabaseColumnLiteral" runat="server" /></umbraco:PropertyPanel>

 <asp:Repeater ID="dtRepeater" runat="server"  >
<ItemTemplate>
<CMSImport:PersistedCaptionPropertyPanel ID="MapDocumentItemPropertyPanel"  Caption='<%# FormatCaption(Eval("PropertyName"),Eval("PropertyAlias"),Eval("PropertyTypeGroup"))%>' runat="server"><CMSImport:CommandDropdownlist ID="datasourceDropdown"  CommandArgument='<%# DataBinder.Eval(Container.DataItem, "PropertyAlias") %>'  OnSelectedIndexChanged="ColumnDropdown_SelectedIndexChanged"  ondatabinding="ColumnDropdown_DataBinding" OnDataBound="ColumnDropdown_DataBound" runat="server" /> <CMSImport:PropertyMapping id="mapping" PropertyAlias='<%# Eval("PropertyAlias") %>' PropertEditorAlias='<%#GetPropertEditorAlias(Container.DataItem) %>' ContentTypeAlias='<%#Eval("ContentTypeAlias") %>' runat="server"  /> </CMSImport:PersistedCaptionPropertyPanel>
</ItemTemplate>
</asp:Repeater>

</umbraco:Pane>