@isTest
public class DataControllerTest 
{
    @testSetup static void setup() {
        // Create a common test account
        Account testAcct = new Account(Name='TestAcct');
        insert testAcct;
        List<Contact> testContacts = new List<Contact>();
        for(Integer i=0;i<2;i++) {
            testContacts.add(new Contact(lastName = 'TestCon'+i , AccountId=testAcct.Id));
        }
        insert testContacts;        
    }
    
    @isTest static void testGetDynamicData() {
        // Get the first test account by using a SOQL query
        Account acct = [SELECT Id FROM Account WHERE Name='TestAcct' LIMIT 1];
        List<Object> obs=DataController.getDynamicData(acct.Id,'Account-Contact');
        System.assertEquals(3, obs.size(),'Thats true - list of objects are returned');
        
        
        
    }

}