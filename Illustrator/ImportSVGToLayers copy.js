// Import SVG Files as Layers - Illustrator CS3 script
// Description: Imports a folder of SVG files as named layers into a new document
// Author: Robert Moggach (rob@moggach.com)
// Version: 0.0.1 on 2014-05-29


function getFolder() {
    return Folder.selectDialog('Please select the folder to be imported:', Folder('~'));
  }
  
  
  function importFolderAsLayers(selectedFolder) {  
    // if a folder was selected continue with action, otherwise quit
    var document;
    var mm = 2.83464567; // Metric MM converter…  
    // Set the script to work with artboard rulers  
    app.coordinateSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM;  
  

    if (selectedFolder) {
      document = app.documents.add(
        DocumentColorSpace.RGB,  
        width = 720*mm,
        height = 720*mm,
      );
      
      var firstImageLayer = true;
      var newLayer;
      var thisPlacedItem;
      var posX=0;
      var posY=0;
      var count=0;
  
      // create document list from files in selected folder
      var imageList = selectedFolder.getFiles();
    
      for (var i = 0; i < imageList.length; i++) {
        if (imageList[i] instanceof File) {
          var fileName = imageList[i].name.toLowerCase();
          if( (fileName.indexOf(".svg") == -1) ) {
            continue;
          } else {
            if( firstImageLayer ) {
              newLayer = document.layers[0];
              firstImageLayer = false;
            } else {
              newLayer = document.layers.add();
            }
            // Give the layer the name of the image file
            newLayer.name = fileName.substring(0, fileName.indexOf(".") );
       
            // Place the image on the artboard
            newGroup = newLayer.groupItems.createFromFile( imageList[i] );
            newGroup.position = [ posX , posY ];
          }
        }
        posX += newGroup.width;
        if(posX > (newGroup.width*16)) {
          posX = 0;
          posY -= newGroup.height;
        }
      }
      if( firstImageLayer ) {
        // alert("The action has been cancelled.");
        // display error message if no supported documents were found in the designated folder
        alert("Sorry, but the designated folder does not contain any recognized image formats.\n\nPlease choose another folder.");
        document.close();
        importFolderAsLayers(getFolder());
      }
    } else {
      // alert("The action has been cancelled.");
      // display error message if no supported documents were found in the designated folder
      alert("Rerun the script and choose a folder with images.");
      //importFolderAsLayers(getFolder());
    }
  }
  
  // Start the script off
  importFolderAsLayers( getFolder() );