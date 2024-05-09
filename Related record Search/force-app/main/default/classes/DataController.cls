public with sharing class DataController {
    public DataController() {

    }


    @AuraEnabled
    public static List<Object> getDynamicData(String recordId,String metadataName){
        try {
            //SELECT Label,Object_API_Name__c FROM Object__mdt WHERE Active__c=true ORDER BY Label]; 
            List<Object> ob = new List<Object>();
            System.debug('recordId '+recordId);
            System.debug('metadataName '+metadataName);
            
            List<String> res = metadataName.split('-');
            System.debug(res);
            String parentId = res[0]+'Id';
            String fromObject = res[1];

           //childObjectChecks(fromObject);
           Related_List_Display_Fields__mdt rec = null;
           try
           {
            rec = [select MasterLabel ,Fields__c from Related_List_Display_Fields__mdt where MasterLabel=:metadataName];

           }
           catch(Exception e)
           {
            System.debug('rec'+rec);
            rec = null;
            return ob;
           }
           
           if(rec==null)
           System.debug('No records found in the metadata'); 
           String recFields = rec.Fields__c;


            
            System.debug('parentId '+parentId);
            System.debug('fromObject '+fromObject);

            List<String> fieldsArr = recFields.split(',');
            System.debug('fieldsArr'+fieldsArr);
           List<Boolean> updatableRights = new List<Boolean>();
            for(String f : fieldsArr)
            {
                updatableRights.add(isUpdateable(fromObject,f));
                //System.debug('IsUpdatable'+isUpdateable());
            }

            String query='select '+ recFields + ' from '+ fromObject + ' where '+ parentId+ '=:recordId';
            System.debug(query);
            List<sObject> sobjList = Database.query(query);
            System.debug(sobjList);

            
            ob.add(sobjList);
            ob.add(fieldsArr);
            ob.add(updatableRights);
            System.debug('ob'+ob);
            return ob;
        } catch (Exception e) {
            System.debug(e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
    }

    public static Boolean isUpdateable(String sObjectType, String fieldName)
{
    SObjectType schemaType = Schema.getGlobalDescribe().get(sObjectType);
    Map<String, SObjectField> fields = schemaType.getDescribe().fields.getMap();
    DescribeFieldResult fieldDescribe = fields.get(fieldName).getDescribe();
    return fieldDescribe.isUpdateable();
}

/*
    public static void childObjectChecks(String fromObject)
    {
            System.debug(Schema.getGlobalDescribe().get(fromObject));
            Schema.SObjectType var1 = Schema.getGlobalDescribe().get(fromObject);
            System.debug('keyset'+var1.getDescribe());
            System.debug('queryable'+var1.getDescribe().queryable);

            //Schema.getGlobalDescribe().get('CONtact').getDescribe().fields.getMap() : Map<String, Schema.SObjectField>
            
            Map<String, Schema.SObjectField> sObjectDetails = Schema.getGlobalDescribe().get(fromObject).getDescribe().fields.getMap();
            System.debug('sObjectDetails '+sObjectDetails);

            for (String fname : sObjectDetails.keySet()) {
                //Schema.DescribeFieldResult dfr = sObjectDetails.get(fname);
                System.debug(fname);
                System.debug('get fname'+sObjectDetails.get(fname));
                
                
                
             }

        

    }

    */
}