import {getObjectInfo} from 'lightning/uiObjectInfoApi';
import { LightningElement,wire,api } from 'lwc';

export default class ObjectApiInformation extends LightningElement 
{
    @api fieldNames;
    @api objectApiName;
    @api options = [];
    @wire(getObjectInfo,{objectApiName : '$objectApiName'})
    objectInfo;

    handleClick(){
       // this.objectApiName = this.template.querySelector('lightning-input').value;
        console.log('###Object Name : '+this.objectApiName);
        console.log('options'+this.options);
    }

    

    handleOptions()
    {
        console.log('objectInfo'+this.objectInfo.data);
       // console.log(Object.keys(this.objectInfo.data));
        //console.log(JSON.stringify(this.objectInfo.data));
        //const objectToMap = ob => Object.fromEntries(maps.entries());
        const objectToMap = obj => new Map(Object.entries(obj));
        try
        {
            if(this.objectInfo!=undefined)
        {
            const abc=objectToMap(this.objectInfo.data);
            console.log('objectToMap'+abc);
            console.log('abc'+abc.get('apiName'));
            //console.log('abc childRelationships'+abc.get('childRelationships'));
            //console.log('abc childRelationships'+JSON.stringify(abc.get('childRelationships')));
            
            const childrenRel = abc.get('childRelationships').map(item => {
                //const container = [];
            //childObjectApiName
            //container.push(item.childObjectApiName);
                
            return item.childObjectApiName;
                //return container;
            })
            //this.options = childrenRel;

            console.log(JSON.stringify(childrenRel));

            const options = childrenRel.map(item=> {
                return { label: item, value: item };
            })
            console.log('options'+JSON.stringify(options));
            this.options= options;
        }
            
        }

        catch(err)
        {
            console.log(err.message);

        }
        
        
        
        
        //console.log(JSON.stringify(this.objectInfo.data));
        //const childRelationships = this.objectInfo.data.childRelationships;
        //console.log(childRelationships);
        return this.objectInfo ? JSON.stringify(this.objectInfo.data,null, 10):'';
  

    }

    

    get objectMetadata(){
        console.log('objectInfo'+this.objectInfo.data);
       // console.log(Object.keys(this.objectInfo.data));
        //console.log(JSON.stringify(this.objectInfo.data));
        //const objectToMap = ob => Object.fromEntries(maps.entries());
        const objectToMap = obj => new Map(Object.entries(obj));
        try
        {
            if(this.objectInfo!=undefined)
        {
            const abc=objectToMap(this.objectInfo.data);
            console.log('objectToMap'+abc);
            console.log('abc'+abc.get('apiName'));
            //console.log('abc childRelationships'+abc.get('childRelationships'));
            //console.log('abc childRelationships'+JSON.stringify(abc.get('childRelationships')));
            
            const childrenRel = abc.get('childRelationships').map(item => {
                //const container = [];
            //childObjectApiName
            //container.push(item.childObjectApiName);
                
            return item.childObjectApiName;
                //return container;
            })
            //this.options = childrenRel;

            console.log(JSON.stringify(childrenRel));

            const options = childrenRel.map(item=> {
                return { label: item, value: item };
            })
            console.log('options'+JSON.stringify(options));
            this.options= options;
        }
            
        }

        catch(err)
        {
            console.log(err.message);

        }
        
        
        
        
        //console.log(JSON.stringify(this.objectInfo.data));
        //const childRelationships = this.objectInfo.data.childRelationships;
        //console.log(childRelationships);
        return '';
    }


    value = 'inProgress';
/*
    get options() {
        return [
            { label: 'New', value: 'new' },
            { label: 'In Progress', value: 'inProgress' },
            { label: 'Finished', value: 'finished' },
        ];
        
    }
*/
    handleChange(event) {
        this.value = this.objectApiName;
        this.value +='-'+event.detail.value;
        console.log('value'+this.value);
        console.log('fieldNames added in property'+this.fieldNames);
    }
/*
    get recordTypeId() {
        // Returns a map of record type Ids
        const rtis = this.objectInfo.data.recordTypeInfos;
        console.log(rtis);
        return rtis;
      }

    get childRelationships()
    {
        const childRelationships= this.objectInfo.data.childRelationships;
        console.log(childRelationships);
        return childRelationships;
    }

    */
}