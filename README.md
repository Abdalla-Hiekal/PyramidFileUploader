# PyramidFileUplaoder V 1.0
PyramidFileUplaoder(PFU) is a Jquery plugin for uplaoding multi files

#### Features:
- **Handle multiple files**.
- **Built-In and Custom Validation**.
- **Server frindly**.
- **Easy to use**.
- **Send all form data to the server**.
- **Flexible**.
- **Secured from XSS Attacks**.

#### Dependencies:
- Jquery.
- Bootstrap V3.
- Sweetalert **you can make it independent by override a function**.

Include in your project
-------
Downlaod PyramidFileUplaoder plugin,Place the Folder "PyramidFileUplaoder" in root directory(if you want to place the Folder and it's files in diffrent location, you will need to change the default directory)

Include js and css files
```html
    <link rel="stylesheet" href="/PyramidFileUplaoder/PyramidFileUplaoder.css">
    <script src="/PyramidFileUplaoder/PyramidFileUplaoder.js"></script>
```

How to use
-------
Simply call the "PyramidFileUplaoder" function & send Required parameters
```javascript
        pyramidFileUplaoder({
            inputFileId: "fileInput", // Id of the input type="file"
            buttonId: "send",          // Id of the button, input & button must be in a form
            containerId: "fileShower", // Container that will show the Choosen files
            URL: "/Project/AddProject", // URl To send data
        },
        function success(result) {   //function to excute in success,"result" is the server response
            //any action ...like redirect
            if (result.state = "ok") {

            location.href = result.data;
            } else {
            swal("Error", result.data, "error"); 
            }
        });
```
This is how it looks like
-------

![alt text](https://raw.githubusercontent.com/Abdalla-Hiekal/PyramidFileUplaoder/master/1.PNG)
-------
In this example I will use ASP.NET MVC as BackEnd (as a server)
-------
Note: inputs&button must be in a form

```cs
        // POST: AddProject
        [HttpPost]
        public ActionResult AddProject(Project project, IEnumerable<HttpPostedFileBase> files)
        {
            try
            {
                int i=0;
                db.Projects.Add(project);
                foreach (var file in files)
                {
                    string Fextintion = Path.GetExtension(file.FileName).ToLower();

                    string Fname = Path.GetFileNameWithoutExtension(file.FileName);
                    string Filename = Fname.Substring(0,8) + RandomString(6)+ i++ + DateTime.Now.ToString("yymmssff") + Fextintion;
                    string path = Path.Combine(Server.MapPath("~/Uploads"), Filename);
                    file.SaveAs(path);
                    db.ProjectImages.Add(new ProjectImage { Role = 0, Image = Filename, ProjectId = project.Id });
                }
                db.SaveChanges();
                return Json(new { state = "ok", data = "/" });
            }
            catch {
                return Json(new { state = "error", data = "Error Happed!" });
            }
        }
```
"AddProject" method receive a object of "project" and list of files from the clientside(PFU)
-------
PFU Architecture&Functions
-------
```
function pyramidFileUplaoder(arg,success,before,errorFun)

arg.extintionSizeError() -> Default: use Sweetalert to show the errors to user, 
parameters: first-> list of files objects have extention error  
^^ second-> list of files objects have size error

success(serverResponse)  ->  Default:empty,function to excute in case of success state
parameters:server_response

before() -> Default:true, if not ture,request will not be sent to the server, 
(used to validate other inputs before send data to the server),parameters:no

errorFun(error) -> Default:empty,excuted when error,parameters:error

```
Example
-------
```javascript
        pyramidFileUplaoder({
            extintionSizeError: function (list1,list2) {  // override...(no longer sweetalert dependant), excuted in error state only
                alert("error");
            },
            inputFileId: "fileInput", // Id of the input type="file"
            buttonId: "send",          // Id of the button, input& button must be in a form
            containerId: "fileShower", // Container that will show the Choosen files
            URL: "/Project/AddProject", // URl To send data
        },
        function success(result) {   //function to excute in success state, "result" is the server response
            //any action ...like redirect
            if (result.state = "ok") {

            location.href = result.data;
            } else {
            swal("Error", result.data, "error"); 
            }
        },
        function before() {
        if ($("#username").val() == "") return false;   //other  validations
        return true;
        },
        function errorFun(error) {
            alert(error.responseText); //show request error , excuted in error state only
        }
        );
```
-------

PFU Validation
-------
Note: dont use clientside validation only,, you have to make your serverside validation
```
min -> determine minimum number of files, Default:0
max -> determine maximum number of files, Default:10
maxSize -> determine minimum size for each file, Default:20 MB
onlyImage -> allow only Image Extintions, Default:false
allowEX -> allow custom Extintions as array eg... ['pdf','doc','docs']
```
Example
-------
```javascript
        pyramidFileUplaoder({
            inputFileId: "fileInput", //  Id of the input type="file"
            buttonId: "send",          //  Id of the button, input& button must be in a form
            containerId: "fileShower", // Container that will show the Choosen files
            URL: "/Project/AddProject", // URl To send data
            max: 4, //Optional
            min: 1, //Optional
            onlyImage: true, //Optional
            maxSize: 4, //4MB, Optional
        },
        function success(result) {   //function to excute in success,"result" is the server response
            //any action ...like redirect
            if (result.state = "ok") {

            location.href = result.data;
            } else {
            swal("Error", result.data, "error"); 
            }
        });
```
-------
PFU Styling
-------
Pyramid File Uplaoder Bootstrap v3 dependant and has a built-in loading mode
Developers can choose their spinning(custom gif loading img)
also, they can change the name and the color of the button
colors:(info,primary,danger, etc..) as bootstrap v3

```
gifLoading -> Default:(root)/PyramidFileUplaoder/Imgs/loading.gif
buttonStyle -> Default:info
buttonName -> Default:Browse
```
Example
-------
```javascript
        pyramidFileUplaoder({
            inputFileId: "fileInput", //  Id of the input type="file"
            buttonId: "send",          //  Id of the button, input& button must be in a form
            containerId: "fileShower", // Container that will show the Choosen files
            URL: "/Project/AddProject", // URl To send data
            gifLoading: "dir/dir/dir/dir/spinning.gif", //Optional
            buttonStyle: 'primary', //Optional
            buttonName: 'Choose Images', //Optional
        },
        function success(result) {   //function to excute in success,"result" is the server response
            //any action ...like redirect
            if (result.state = "ok") {

            location.href = result.data;
            } else {
            swal("Error", result.data, "error"); 
            }
        });
```
-------

PFU Directory
-------
Pyramid File Uplaoder has "Imgs" folder,if you want to move  this... you will need to change the value of "imgsUrl"
Default:'root/PyramidFileUplaoder/Imgs'

Example
-------
```javascript
        pyramidFileUplaoder({
            inputFileId: "fileInput", //  Id of the input type="file"
            buttonId: "send",          //  Id of the button, input& button must be in a form
            containerId: "fileShower", // Container that will show the Choosen files
            URL: "/Project/AddProject", // URl To send data
            imgsUrl: "dir/dir/dir/dir/", //Optional,required in case of change directory
        },
        function success(result) {   //function to excute in success,"result" is the server response
            //any action ...like redirect
            if (result.state = "ok") {

            location.href = result.data;
            } else {
            swal("Error", result.data, "error"); 
            }
        });
```
-------
Version 1.1 soon!
