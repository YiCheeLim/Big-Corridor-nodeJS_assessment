# Grocery-app - Assessment

# Question

REQUIREMENTS:

Page 1

1. Search form (mandatory fields)
    1. Brand
    2. Product Name

2. List of Groceries
    1. Display a list of 20 products by default, with the Product Name arranged in alphabetical order
    2. Options to sort grocery list by Brand or Product Name from A-Z and Z-A
    3. Each product in the grocery list should display the following:
        * UPC12 Barcode
        * Brand
        * Product Name
        * Edit button (that will lead to Page 2)
    4. Search result should include all possibilities based on keywords found in Brand or Product Name fields
    5. You may use GET or POST methods for the search


Page 2

1. Edit product form (mandatory fields)
    * Brand (varchar)
    * Product Name (varchar)
    * UPC12 Number (bigint)
    * Save button (saves changes made before returning to the Grocery List)
    * Cancel button (brings you back to the Grocery List without saving)
    * Prevent saving of empty Brand and Product Name fields
    * Warn if invalid characters are entered into the fields (e.g. UPC12 field should accept only integers)

2. Editing a product
    * Pre-populate the form with the product’s info (i.e. if you entered this page by clicking on the Edit button of Product A, the form should display the Brand, Product Name, and UPC12 Number of Product A)
    * Saving should be done by the POST or PUT method only
    * Grocery List should also reflect the changes made to the product

  
# Points to note

### Do not forget npm init / bower init ###
  
  When you work in a team, everyone should be aware of the packages that you are using and package.json / bower.json tell them what all packages does this project depend on. 
  
### Don't forget to add a .gitignore ###

  Adding unnecessary files to your repo will increase the size of the repo such as node_modules, bower_components, .idea folder etc.
    
    For eg., the `.idea` folder contains meta data related to your project. like.. 
    * data structures to access files quickly & for auto completion
    * local history
    * ... lots of stuff that other's probably don't need!
    
    These will be different for all the people working on the project. And keeping this in repo means you'll have to maintain and merge the changes to files. 
    
    Use any free service to generate a comprehensive gitignore file for you such as https://www.gitignore.io/

### More things to take note of ###
  
1. Avoid using variables without declaring them with `var` - it pollutes the global scope (meaning you'll run out of variable names) and is generally considered bad for memory consumption. Believe us, this _WILL_ come to bite you  in production applications!

2. Check empty form submissions. Generally a good practice and shows that you're thorough with your data validation before submitting to an API.

3. Check if data is received on backend as expected and log any error messages for easier debugging. It does not make sense if you only return a 500 error and don't know why it happened. 

4. `npm install` VS `npm install --save`

5. Always display error messages when encountered in catch callbacks on the front end. 

6. Never expose bower.json / package.json. The world doesn't need to know what packages you're using and neither should you tell them. Move `bower.json` out of the `public` directory and add a static path to the `bower_components` folder in express. 

    `app.use('/bower_components', express.static(__dirname + '/bower_components'));`
