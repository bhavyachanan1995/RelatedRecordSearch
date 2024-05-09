import { LightningElement, wire , api} from 'lwc';
import {getObjectInfo} from 'lightning/uiObjectInfoApi';
//getDynamicData
import { updateRecord } from "lightning/uiRecordApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { refreshApex } from "@salesforce/apex";
import retrieveDynamicData from '@salesforce/apex/DataController.getDynamicData';

export default class RelatedListDynamicFeatures extends LightningElement 
{
    loading=true;
    noRecordsMessage='No data available yet';
    @api recordId;
    @api objectApiName;
    @api options = [];
    recordList=[];
    columns=[];
    draftValues=[];
    value='Not selected';
    loadRecords=false;

    searchKey='';
    initialRecords;




    @wire(getObjectInfo,{objectApiName : '$objectApiName'})
    objectInfo(data,error){
        if(data)
        {
            console.log('Data'+data)
            //console.log('Data'+JSON.stringify(data));


            const objectToMap = obj => new Map(Object.entries(obj));
        try
        {
            if(data!=undefined)
        {
            console.log('inside if data');
            //console.log(JSON.stringify(data.data));
            const abc=objectToMap(data.data);
           // console.log('objectToMap'+abc);
            console.log('abc'+abc.get('apiName'));
            //console.log('abc childRelationships'+abc.get('childRelationships'));
            //console.log('abc childRelationships'+JSON.stringify(abc.get('childRelationships')));
            console.log('abc childRelationships '+JSON.stringify(abc.get('childRelationships')));
            const childrenRel = abc.get('childRelationships').map(item => {
                //const container = [];
            //childObjectApiName
            //container.push(item.childObjectApiName);
                
            //return item.childObjectApiName;
            return { label: item.childObjectApiName, value: item.childObjectApiName };
                //return container;
            })
            //this.options = childrenRel;

            //console.log(JSON.stringify(childrenRel));
            this.options = childrenRel;

            /*
            const options = childrenRel.map(item=> {
                return { label: item, value: item };
            })
            console.log('options'+JSON.stringify(options));
            this.options= options;
            */
        }
    }

        catch(error)
        {
            console.log('error inside try'+error.message)

        }


        }
        if(error)
        {
            console.log('Error'+this.error);

        }
        this.loading=false;
    };


    retrieveDynamicDataFromServer()
    {
        try
        {
            
        retrieveDynamicData({recordId:this.recordId,metadataName:this.value})
        .then((result) =>{
            console.log('result'+result);
            let records = [];
            records = result[0];
            if(records!=null)
            {
            this.loadRecords=true;
            let fields = [];
            fields = result[1];
            let editableRights=[];
            editableRights=result[2];
            console.log('records json'+JSON.stringify(records));
            console.log('fields'+fields);
            console.log('editable rights '+editableRights);
            this.recordList = records;
            this.initialRecords = records;
            console.log('recordList'+this.recordList);
            this.columns = [];
            
            for(let i=0; i<fields.length;i++)
            {
                console.log('field '+fields[i]);
                console.log('editable rights '+editableRights[i])
                this.columns = [...this.columns, {
                    label: fields[i],
                    fieldName: fields[i],
                    editable: editableRights[i],
                }];
                console.log('columns'+this.columns);
            }

            }
            
            
            else
            {
                this.loadRecords=false;
                this.noRecordsMessage='Data is not available for this child Object'


            }
            
            
            /*
            this.listColumn = [];
            for (i = 0; i < this.fieldValue.length; i++) {
            this.listColumn = [...this.listColumn, {
                label: this.fieldValue[i],
                fieldName: this.fieldValue[i],
                hideDefaultActions: true
            }];
        }



            */


        }).catch((error)=>{
            console.log('error inside promise'+JSON.stringify(error.message));
        })

        }

        catch(e)
        {
            console.log(e.message);
        }
    }


    handleOptions(event)
    {
        console.log('inside handleOptions');
        this.value = this.objectApiName+'-'+event.detail.value;
        console.log('value '+this.value);
        console.log('recordId this'+this.recordId);
        
        this.retrieveDynamicDataFromServer();

        
    }

    handleSave(event)
    {
        console.log('objectInfo'+this.objectInfo);
        console.log('inside handle save');
        //const records = event.detail.draftValues.slice().map((draftValue) => {
            //const fields = Object.assign({}, draftValue);
            const records = event.detail.draftValues
            console.log('records draftvalues'+records);
            const recordInputs = event.detail.draftValues.slice().map((draft) => {
                const fields = Object.assign({}, draft);
                return { fields };
              });
              console.log("recordInputs:", JSON.stringify(recordInputs));
              const promises = recordInputs.map((recordInput) => {
                return updateRecord(recordInput);
              });
              console.log('promises'+promises);
              Promise.all(promises)
                .then((rec) => {
                  console.log("::inside then" + rec);
                  this.dispatchEvent(
                    new ShowToastEvent({
                      title: "Success",
                      message: "Records updated",
                      variant: "success"
                    })

                    

                  );
                  //Clear all draft values
                  this.retrieveDynamicDataFromServer();
                  this.draftValues = [];
                  
          
                                })
                .catch((error) => {
                  console.log("error", JSON.stringify(error));
                  this.dispatchEvent(
                    new ShowToastEvent({
                      title: "Error on update",
                      message:
                        error.body.message +
                        "- " +
                        error.body.errorCode,
                      variant: "error"
                    })
                  );
                });
            }



            handleSearch(event) {
                try
                {
                    console.log('inside handle search');
                    console.log('event,target '+event.target.value);
                    let searchKey = event.target.value.toLowerCase();
                    console.log('searchkey event target'+ searchKey);
                //this.searchKey = event.target.value.toLowerCase();
                console.log('search key again '+ searchKey);
                if (searchKey) {
                    this.recordList = this.initialRecords;
                    console.log('initial records inside search key'+this.initialRecords)
         
                    if (this.recordList) {
                        console.log('inside if recorlist search'+this.recordList)
                        let searchRecords = [];
         
                        for (let record of this.recordList) {
                            let valuesArray = Object.values(record);
                            console.log('valuesArray '+valuesArray)
         
                            for (let val of valuesArray) {
                                console.log('val is ' + val);
                                let strVal = String(val);
         
                                if (strVal) {
         
                                    if (strVal.toLowerCase().includes(searchKey)) {
                                        searchRecords.push(record);
                                        break;
                                    }
                                }
                            }
                        }
         
                        console.log('Matched Accounts are ' + JSON.stringify(searchRecords));
                        this.recordList = searchRecords;
                    }
                } else {
                    
                    this.recordList = this.initialRecords;
                    console.log('inside else search initial records'+this.recordList)
                }

                }

                catch(error)
                {
                    console.log('error for search'+error.message);
                }
                
            }
    }