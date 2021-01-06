//Pyramid File Uploader V 1.5
//Created & Developed by Abdalla Mahmoud Hiekal
//Main Function
function pyramidFileUploader(arg, success, before, errorFun) {
    //init 
    var Files = [];
    var numberFiles = 0;
    var FileId = 0;
    var imgEx = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'dib', 'webp', 'svgz', 'ico', 'svg', 'tif', 'xbm', 'bmp', 'jfif', 'pjpeg', 'pjp', 'tiff'];
    arg.buttonName = typeof arg.buttonName !== 'undefined' ? arg.buttonName : 'Browse';
    arg.buttonStyle = typeof arg.buttonStyle !== 'undefined' ? arg.buttonStyle : 'info';
    arg.imgsUrl = typeof arg.imgsUrl !== 'undefined' ? arg.imgsUrl : document.location.origin + '/PyramidFileUploader/Imgs/';
    arg.gifLoading = typeof arg.gifLoading !== 'undefined' ? arg.gifLoading : arg.imgsUrl + 'loading.gif';
    arg.onlyImage = typeof arg.onlyImage !== 'undefined' ? arg.onlyImage : false;
    arg.maxSize = typeof arg.maxSize !== 'undefined' ? arg.maxSize : 25;
    arg.allowEX = typeof arg.allowEX !== 'undefined' ? arg.allowEX : [];
    arg.max = typeof arg.max !== 'undefined' ? arg.max : 10;
    arg.min = typeof arg.min !== 'undefined' ? arg.min : 0;
    before = typeof before !== 'undefined' ? before : true;

    //multiple file
    $("#" + arg.inputFileId).attr("multiple", "");

    //Only image
    if (arg.onlyImage) {
        $("#" + arg.inputFileId).attr("accept", "image/*");
        arg.allowEX = imgEx;
    }

    //File Container(not image container)
    //fileContainerId="p-"+arg.containerId+"file";
    //$("#"+arg.containerId).after( "<div id='"+fileContainerId+"' ></div>" );

    //Hide input, Show button
    $("#" + arg.inputFileId).after("<span class='btn btn-" + arg.buttonStyle + "' id='p-customFile'>" + arg.buttonName + "</span>");
    $("#" + arg.inputFileId).hide();

    //Click Button
    $("#p-customFile").on("click", function () {
        $("#" + arg.inputFileId).click();
    });

    //Loading Mode
    element = "<div id='p-loading' class='p-MyModalPanel'><img src='" + arg.gifLoading + "' class='p-imgLoad' /><br /><span class='p-textLoad'>Loading ....</span></div>";
    $("body").append(element);

    //Add files
    $("#" + arg.inputFileId).on("change", function () {
        var availableIcons = ['3ds', 'aac', 'ai', 'avi', 'cad', 'html', 'cdr', 'css', 'dat', 'dll', 'dmg', 'indd', 'iso', 'flv', 'doc', 'esp', 'fla', 'txt', 'wmv', 'xls', 'sql', 'ps', 'tif', 'pdf', 'psd', 'raw', 'ppt', 'php', 'js', 'midi', 'xml', 'mov', 'mp3', 'zip', 'mpg'];
        var extentionError = [];
        var sizeError = [];
        var files = document.getElementById(arg.inputFileId).files;

        for (i = 0; i < files.length; i++) {
            var errorFlag = 0;
            var filename = files[i].name;
            var EX = filename.substr(filename.lastIndexOf('.') + 1);
            var fileEX = EX.toLowerCase();

            //Validation
            if (arg.allowEX.length > 0) {
                if ($.inArray(fileEX, arg.allowEX) == -1) {
                    extentionError.push(files[i]);
                    errorFlag = 1;
                    //continue;
                }
            }

            if (files[i].size / 1024 / 1024 > arg.maxSize) {
                sizeError.push(files[i]);
                errorFlag = 1;
            }

            if (errorFlag == 1) {
                continue;
            }

            // Push the file
            FileId++;
            var file = {};
            file.File = files[i];
            file.Id = FileId;
            Files.push(file);
            console.log(FileId+" ");

            if ($.inArray(fileEX, imgEx) != -1) {
                var reader = new FileReader();
                // Setup   
                reader.onload = (function (file) {
                    return function (e) {
                        // Render thumbnail.
                        $("#" + arg.containerId).append("<div class='col-md-2'><div class='pfu-box'><img  class='p-img' src='" + e.target.result + "' title='" + escape(file.File.name) + "' />" +
                            "<button class='btn btn-danger p-fileDel p-fileDel-img' id='" + file.Id+ "' type='button'>Delete</button>" +
                            "</div></div>");
                    };
                })(file);

                // Process file
                reader.readAsDataURL(files[i]);
                console.log(FileId + " ");

            } else {

                if ($.inArray(fileEX, availableIcons) == -1) {
                    imgSrc = arg.imgsUrl + 'default.png';
                } else {
                    imgSrc = arg.imgsUrl + fileEX + '.png';
                }
                $("#" + arg.containerId).append("<div class='col-md-2'><div class='pfu-box'><img src='" + imgSrc + "'  class='p-item' /><p>" + escape(files[i].name).substring(0, 27) + "</p>" +
                    "<button class='btn btn-danger p-fileDel p-fileDel-item' id='" + FileId + "' type='button' >Delete</button>" +
                    "</div></div>");
            }
        }
        if (extentionError.length > 0 || sizeError.length > 0) {
            if (typeof arg.ExtintionSizeError === 'undefined') {
                arg.ExtintionSizeError = function (extention, size) {
                    if (extention.length > 0 && size.length > 0) {
                        swal("Error", "File extintion should be " + arg.allowEX.toString() + " and less than or equal " + arg.maxSize + " MB", "error");
                    } else if (extention.length > 0) {
                        swal("Error", "File extintion should be " + arg.allowEX.toString() + " ", "error");
                    } else if (size.length > 0) {
                        swal("Error", "File extintion should be less than or equal " + arg.maxSize + " MB", "error");
                    }
                };
            }
            arg.ExtintionSizeError(extentionError, sizeError);
        }
    });

    //Delete file
    $(document).on("click", ".p-fileDel", function () {
        var index = 0;
        var Id = $(this).attr('id');
        for (index = 0; index < Files.length; index++) {
            if (Files[index].Id == Id) {
                Files.splice(index, 1);
                $(this).parent().parent().remove();
                break;
            }
        }
    });

    //Send data to the  server
    $("#" + arg.buttonId).click(function (e) {
        e.preventDefault();
        if (before) {

            if (Files.length < arg.min || Files.length > arg.max) {
                if (typeof arg.numError === 'undefined') {
                    arg.numError = function (a) {
                        if (Files.length > arg.max) {
                            swal("Error", "Maximum  number of files is " + arg.max, "error");
                        } else {
                            swal("Error", "Minimum  number of files is " + arg.min, "error");
                        }
                    };
                }
                arg.numError(Files.length);
                return;
            }

            $('#p-loading').show();

            formData = new FormData($("#" + arg.inputFileId).closest("form").get(0));
            parametername = $("#" + arg.inputFileId).attr('name');
            formData.delete(parametername);
            if (Files.length == 1) {
                formData.append(parametername, Files[0].File);
            } else {
                for (var j = 0; j < Files.length; j++) {
                    formData.append(parametername + "[" + j + "]", Files[j].File);
                }
            }
            $.ajax({
                url: arg.URL,
                type: 'POST',
                cache: false,
                dataType: 'json',
                data: formData,
                processData: false,
                contentType: false,
                success: function (result) {
                    success(result);
                },
                error: function (error) {
                    errorFun(error);
                }
            });
            $('#p-loading').hide();
        }
    });

}