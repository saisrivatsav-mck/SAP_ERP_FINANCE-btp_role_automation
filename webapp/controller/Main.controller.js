sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Component",
    "sap/ui/core/BusyIndicator",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/export/Spreadsheet"
], (Controller, UIComponent, BusyIndicator, Filter, FilterOperator, MessageBox, MessageToast, Spreadsheet) => {
    "use strict";

    return Controller.extend("mck.fin.btproleautomation.controller.Main", {
        onInit() {
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("RouteMain").attachPatternMatched(this.onRouteMatched, this);
            this.getOwnerComponent().getModel("RoleCollections").setData([]);
        },
        
        onRouteMatched: function(oEvent){ 
            if (this.getOwnerComponent().getModel("RoleCollections").getData().length === 0) {
                this.setPageData();
            }
        },

        setPageData: function(oEvent){
            // BusyIndicator.show();            
            this._getRoleCollections();
        },

        _getRoleCollections: async function(){
            var totalRoles = 0;
            const sUrl = this.getOwnerComponent().getManifestObject().resolveUri(this.getOwnerComponent().getManifestEntry("sap.app").dataSources.roleCollectionService.uri);
            try {
                const response = await fetch( `${sUrl}/rolecollections?showRoles=true&showUsers=true`, {
                    method: "GET",
                    contentType: "application/json",
                    dataType: "json"
                } );
                if (!response.ok) {
                    const errorText = await response.text();                    
                    BusyIndicator.hide();
                    MessageBox.error(errorText);
                }else{                    
                    const result = await response.json();
                    //Set the page to visible
                    this.getView().byId("mck-btproles-dynPage").setBusy(false);
                    //Set Total Role Collections
                    this.getView().byId("mck-btproles-totRoleColl").setText(result.length);
                    this.getOwnerComponent().getModel("RoleCollections").setData(result);
                }
            } catch (error) {
                BusyIndicator.hide();
                MessageBox.error("Error fetching role collections");
                console.log(error);
            }
        },

        onRoleCollSelect(oEvent){
            const selectedPaths = oEvent.getSource().getSelectedContexts();
            if (selectedPaths.length > 0) {
                this.getView().byId("mck-btproles-transBadge").setValue(selectedPaths.length);
                this.getView().byId("mck-btproles-exportBadge").setValue(selectedPaths.length);
            }else{
                this.getView().byId("mck-btproles-transBadge").setValue("");
                this.getView().byId("mck-btproles-exportBadge").setValue("");
            }       
        },

        onLiveSearch(oEvent){
            var sQuery = oEvent.getParameter("newValue");
            var oTable = this.getView().byId("mck-btproles-roleColTab");
            var oBinding = oTable.getBinding("items");
            var aFilters = [];
            if (sQuery) {
                var oFilterName = new Filter("name", FilterOperator.Contains, sQuery);
                var oCombinedFilter = new Filter({
                    filters: [oFilterName]
                });
                aFilters.push(oCombinedFilter);
            }
            oBinding.filter(aFilters);
        },

        onRolesRequest: function(oEvent){
            const oSelectedRoleCol = oEvent.getSource();
            const selectedIndex = oSelectedRoleCol.getBindingContext("RoleCollections").sPath.split("/")[1];
            const roleCollectionName = this.getOwnerComponent().getModel("RoleCollections").getData()[selectedIndex].name;
            const oRouter = this.oRouter;
            oRouter.navTo("RouteRolesView",{
                roleCollectionName: roleCollectionName
            });
        },

        onExport(oEvent){
            var exportAll = false;
            var oTable = this.getView().byId("mck-btproles-roleColTab");
            var oSelectedContexts = oTable.getSelectedContexts();
            var aSelectedData = oSelectedContexts.map(function(oContext){
                return oContext.getObject();
            });
            if (aSelectedData.length === 0) {
                MessageBox.confirm("Are you sure, you want to export the whole list?",{
                    actions: ["Yes", MessageBox.Action.CLOSE],
                    emphasizedAction: "Yes",
                    onClose: function(sAction){
                        exportAll = true;
                    }
                });
            }
            if (exportAll) {
                
            }
            var aColumns = [
                {
                    label: "Role Collection Name",
                    property: "name"
                },
                {
                    label: "Description",
                    property: "description"
                }
            ];
            var oSettings = {
                workbook: {
                    columns: aColumns,
                    context:{}
                },
                dataSource: aSelectedData,
                fileName: "RoleCollections.xlsx"
            };
            var oSpreadsheet = new Spreadsheet(oSettings);
            oSpreadsheet.build().then(function(){
                MessageToast.show("Data exported sucessfully");
            }).finally(function(){
                oSpreadsheet.destroy();
            })
        }
    });
});