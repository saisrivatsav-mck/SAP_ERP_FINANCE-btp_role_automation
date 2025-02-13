sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/core/BusyIndicator",
    "mck/fin/btproleautomation/model/models"
], (UIComponent, BusyIndicator, models) => {
    "use strict";

    return UIComponent.extend("mck.fin.btproleautomation.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();

            //BusyIndicator.show();
            //this._getRoleData();           
        },

        async _getRoleData(){
            const sUrl = this.getManifestObject().resolveUri(this.getOwnerComponent().getManifestEntry("sap.app").dataSources.roleCollectionService.uri);
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
                    this.setModel(result, "RoleCollections");                    
                    BusyIndicator.hide();
                }
            } catch (error) {
                BusyIndicator.hide();
                MessageBox.error("Error fetching role collections");
                console.log(error);
            }
        }
    });
});