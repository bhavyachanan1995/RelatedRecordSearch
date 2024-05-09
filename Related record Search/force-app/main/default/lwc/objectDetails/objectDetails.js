import { LightningElement ,api , wire} from 'lwc';
import retrieveAccounts from '@salesforce/apex/DataController.retrieveAccounts';
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import ACCOUNT_OBJECT from "@salesforce/schema/Account";
const columns = [
    { label: 'Name', fieldName: 'Name' , editable: true , },
    { label: 'Type', fieldName: 'Type', editable: true ,  },
    { label: 'BillingCountry', fieldName: 'BillingCountry' , editable: true , },       
];
export default class ObjectDetails extends LightningElement 
{
    @api recordId;
    @api objectApiName;
    @api flexipageRegionWidth;
    objectName='';

    data;
    columns = columns;
    error;
    
    connectedCallback()
    {
        //console.log('this.objectAPIName '+ this.objectApiName);
        this.objectName=this.objectApiName;
        console.log('this.objectName'+this.objectName);
        console.log(objectInfo.data);
    }

     @wire(getObjectInfo, { objectApiName: '$objectApiName' })
  objectInfo;

    @wire(retrieveAccounts)
    wiredAccounts({ error, data }) {
        if (data) {
            this.data = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.data = undefined;
        }
    }

    handleSave(event)
    {
        console.log('inside handle save');
        //const records = event.detail.draftValues.slice().map((draftValue) => {
            //const fields = Object.assign({}, draftValue);
            const records = event.detail.draftValues
            console.log('records'+records);
    }
    get objectMetadata(){
        return this.objectInfo ? JSON.stringify(this.objectInfo.data,null, 10):'';
    }
    getSelectedName(event) {
        //console.log('ObjectInfo'+JSON.Stringify(this.objectInfo.data));
        const selectedRows = event.detail.selectedRows;
        console.log(selectedRows);
        // Display that fieldName of the selected rows

    }
}