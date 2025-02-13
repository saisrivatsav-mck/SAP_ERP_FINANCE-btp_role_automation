sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/BusyIndicator",
    "sap/m/MessageBox"
], (Controller, BusyIndicator, MessageBox) => {
    "use strict";

    return Controller.extend("mck.fin.btproleautomation.controller.RolesView", {
        onInit() {
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("RouteRolesView").attachPatternMatched(this.onRouteMatched, this);
        },
        
        onRouteMatched: function(oEvent){
            this.getView().getModel("Roles").setData([]);            
            this.getView().getModel("Users").setData([]);            
            this.setPageData(oEvent);
        },

        setPageData: function(oEvent){
            this._i18nModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            this.getView().getModel("Roles").setData([]);
            this.getView().getModel("Users").setData([]);
            const roleCollection = oEvent.getParameter("arguments").roleCollectionName;
            this.getView().byId("mck-btproles-objPageTitle").setText(roleCollection);
            this.getView().byId("mck-btproles-objPageSnapTitle").setText(roleCollection);
            const description = this.getOwnerComponent().getModel("RoleCollections").getData().find(rolecol => rolecol.name === roleCollection)?.description || "";
            this.getView().byId("mck-btproles-objPageSubTitle").setText(description);
            this.getView().byId("mck-btproles-objPageSubSnapTitle").setText(description);
            this.getRoles(roleCollection);
        },

        getRoles(roleCollectionName){
            const mainData = this.getOwnerComponent().getModel("RoleCollections").getData();            
            const roles = mainData.find(roleCol => roleCol.name === roleCollectionName)?.roleReferences || [];
            const users = mainData.find(roleCol => roleCol.name === roleCollectionName)?.userReferences || [];
            if (roles) {
                this.getView().getModel("Roles").setData(roles);
            }
            if (users) {
                this.getView().getModel("Users").setData(users);
            }
        },

        onNavBack(oEvent){
            const oRouter = this.oRouter;
            oRouter.navTo("RouteMain");
        }
    });
});