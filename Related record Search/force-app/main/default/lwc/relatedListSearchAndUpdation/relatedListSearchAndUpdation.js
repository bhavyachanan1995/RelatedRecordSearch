import { LightningElement , wire ,track , api} from 'lwc';
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import retrieveAccounts from '@salesforce/apex/DataController.retrieveAccounts';
const columns = [
    { label: 'Name', fieldName: 'Name' , editable: true , },
    { label: 'Type', fieldName: 'Type', editable: true ,  },
    { label: 'BillingCountry', fieldName: 'BillingCountry' , editable: true , },       
];

export default class RelatedListSearchAndUpdation extends LightningElement 
{
    @api recordId;
    @api objectApiName;
    @api flexipageRegionWidth;

    @track data;
    @track columns = columns;
    @track error;
    


    @wire(getObjectInfo, { objectApiName: this.objectApiName })
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

    getSelectedName(event) {
        const selectedRows = event.detail.selectedRows;
        console.log(selectedRows);
        // Display that fieldName of the selected rows

    }
}