// Import SVG Files as symbols and save it as library - Illustrator CS3 script



function getFolder() {
  return Folder.selectDialog('select Top folder:', Folder('~/icons4Test'));
}


function processTopFolder(topFolder) {

  listOfAssets = topFolder.getFiles();

  // icon-service from  microsoft 

  var document = prepareDocument();

  var NewLibFile = newLibraryFile(topFolder, topFolder);

  ImportSVG2Symbols(topFolder, topFolder, document);  // process top folder first
  SaveAndClose(document, NewLibFile)


  //then process each subfolder
  if (processRecursive) {
    for (var f = 0; f < listOfAssets.length; f++)
      if (listOfAssets[f] instanceof Folder) {
        var document = prepareDocument();
        var NewLibFile = newLibraryFile(topFolder, listOfAssets[f]);

        ImportSVG2Symbols(listOfAssets[f], topFolder, document);
        SaveAndClose(document, NewLibFile)
      }
      else continue;
  }
}


function newLibraryFile(topFolder, currentFolder) {
  var fileNameToSaveLib = topFolder + "/" + libNamePrefix + currentFolder.name + '.ai';
  var libFile = new File(fileNameToSaveLib);
  return libFile;
}


function prepareDocument() {

  var document;
  var mm = 2.83464567; // Metric MM converter…  
  // Set the script to work with artboard rulers  
  app.coordinateSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM;
  document = app.documents.add(DocumentColorSpace.RGB, width = 720 * mm, height = 720 * mm,);
  document.symbols.removeAll();

  return document;

}


function ImportSVG2Symbols(selectedFolder, topFolder, document) {

  if (selectedFolder) {

    var newLayer = document.layers.add();
    newLayer.name = selectedFolder.name;

    //redraw();

    var posX = 0;
    var posY = 0;

    //redraw();

    // create document list from files in selected folder
    var imageList = selectedFolder.getFiles();

    for (var i = 0; i < imageList.length; i++) {
      if (imageList[i] instanceof File) {
        var fileName = imageList[i].name.toLowerCase();
        if ((fileName.indexOf(".svg") == -1)) {
          continue;
        } else {

          // Place the image on the artboard
          var newGroup = newLayer.groupItems.createFromFile(imageList[i]);



          newGroup.position = [posX, posY];

          //newGroup2.position = [posX, posY];

          // next block is to resize the image proportionally
          newGroup = resizeGroup(newGroup);


          var newSymbolName = fileName.substring(0, fileName.indexOf("."));

          if (removefileParts)
            newSymbolName = newSymbolName.substring(newSymbolName.indexOf(FilePart) + FilePart.length);

          newSymbolName = libNamePrefix + newSymbolName;  //adding vendor prefix if set

          var newSymnbol = document.symbols.add(newGroup);


          newSymnbol.name = newSymbolName


          newGroup.remove(); //remove so it can be saved as library.


        }
      }
    }


  }
}


function SaveAndClose(document, fileName) {
  document.saveAs(fileName)
  document.close();
}



function resizeGroup(newGroup) {
  var divRatio;
  if ((newGroup.height >= iconSizeWithProportion) || (newGroup.width >= iconSizeWithProportion))  // at least one is > 50 
  {
    if (newGroup.height > newGroup.width) {    // use high as driving size factor
      divRatio = newGroup.height / iconSizeWithProportion;
      newGroup.height = iconSizeWithProportion;
      newGroup.width = newGroup.width / divRatio;
    }
    else {   // use width as the driving  factor
      divRatio = newGroup.width / iconSizeWithProportion;
      newGroup.width = iconSizeWithProportion;
      newGroup.height = newGroup.height / divRatio;
    }

  }
  else {   // both are less than 50 ;
    if (newGroup.height > newGroup.width) {    // use high as driving size factor
      divRatio = iconSizeWithProportion / newGroup.height;
      newGroup.height = iconSizeWithProportion;
      newGroup.width = newGroup.width * divRatio;
    }
    else {   // use width as the driving  factor
      divRatio = iconSizeWithProportion / newGroup.width;
      newGroup.width = iconSizeWithProportion;
      newGroup.height = newGroup.height * divRatio;
    }


  }
  return newGroup;

}



//set preferences for each vendor. each of the three main vendors have their own naming convention.


var FilePart = '';
var removefileParts = false;
var vendor = 'AZ';
var processRecursive = true;
var libNamePrefix = '';
var iconSizeWithProportion = 60;



function prepareVendor() {
  switch (vendor) {
    case 'CGP':     // google
      libNamePrefix = 'GCP-';
      break;

    case 'AZ':     // azure
      FilePart = 'icon-service-';
      removefileParts = true;
      libNamePrefix = 'AZ-';
      break;
    case 'AWS':     // Amazon
      break;


    default:
      break;
  }

}


prepareVendor();
var rootDocument = prepareDocument();
var rootLayer = rootDocument.layers.add();
rootLayer.name = 'symbolHolder';  
var rootFolder = getFolder();
var rootFileNameToSaveLib = rootFolder + "/" + libNamePrefix + 'All.ai';
var rootFile = new File(rootFileNameToSaveLib)
ImportSVG2Symbols(processTopFolder(rootFolder));
SaveAndClose(rootDocument, rootFile)