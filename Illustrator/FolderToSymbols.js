// Import Folder's Files as Symbols - Illustrator CC script

// Description: Creates symbols from images in the designated folder into current document

// Author     : Oscar Rines (oscarrines (at) gmail.com)

// Version    : 1.0.0 on 2014-09-21

// Reused code from "Import Folder's Files as Layers - Illustrator CS3 script"

// by Nathaniel V. KELSO (nathaniel@kelsocartography.com)


function getFolder() {


    //return new  Folder('/c/Users/hugor/icons4Test');
    return Folder.selectDialog('Please select the folder to be imported:', Folder('/c/Users/hugor/icons4Test/Compute'));

}




function symbolExists(seekInDoc, seekSymbol) {


    for (var j = 0; j < seekInDoc.symbols.length; j++) {


        if (seekInDoc.symbols[j].name == seekSymbol) {


            return true;


        }


    }



    return false;


}




function importFolderContents(selectedFolder) {


    var activeDoc = app.activeDocument; //Active object reference




    // if a folder was selected continue with action, otherwise quit


    if (selectedFolder) {


        var newsymbol; //Symbol object reference


        var placedart; //PlacedItem object reference


        var fname; //File name


        var sname; //Symbol name 


        var symbolcount = 0; //Number of symbols added





        var templayer = activeDoc.layers.add(); //Create a new temporary layer


        templayer.name = "Temporary layer"



        var imageList = selectedFolder.getFiles(); //retrieve files in the folder





        // Create a palette-type window (a modeless or floating dialog),


        var win = new Window("palette", "SnpCreateProgressBar", {
            x: 100,
            y: 100,
            width: 750,
            height: 310
        });


        win.pnl = win.add("panel", [10, 10, 740, 255], "Progress"); //add a panel to contain the components


        win.pnl.currentTaskLabel = win.pnl.add("statictext", [10, 18, 620, 33], "Examining: -"); //label indicating current file being examined


        win.pnl.progBarLabel = win.pnl.add("statictext", [620, 18, 720, 33], "0/0"); //progress bar label


        win.pnl.progBarLabel.justify = 'right';


        win.pnl.progBar = win.pnl.add("progressbar", [10, 35, 720, 60], 0, imageList.length - 1); //progress bar


        win.pnl.symbolCount = win.pnl.add("statictext", [10, 70, 710, 85], "Symbols added: 0"); //label indicating number of symbols created


        win.pnl.symbolLabel = win.pnl.add("statictext", [10, 85, 710, 100], "Last added symbol: -"); //label indicating name of the symbol created


        win.pnl.errorListLabel = win.pnl.add("statictext", [10, 110, 720, 125], "Error log:"); //progress bar label


        win.pnl.errorList = win.pnl.add("edittext", [10, 125, 720, 225], "", {
            multiline: true,
            scrolling: true
        }); //errorlist


        //win.pnl.errorList.graphics.font = ScriptUI.newFont ("Arial", "REGULAR", 7);


        //win.pnl.errorList.graphics.foregroundColor = win.pnl.errorList.graphics.newPen(ScriptUIGraphics.PenType.SOLID_COLOR, [1, 0, 0, 1], 1);


        win.doneButton = win.add("button", [640, 265, 740, 295], "OK"); //button to dispose the panel


        win.doneButton.onClick = function() //define behavior for the "Done" button


        {


            win.close();


        };


        win.center();


        win.show();





        //Iterate images


        for (var i = 0; i < imageList.length; i++) {


            win.pnl.currentTaskLabel.text = 'Examining: ' + imageList[i].name; //update current file indicator


            win.pnl.progBarLabel.text = i + 1 + '/' + imageList.length; //update file count


            win.pnl.progBar.value = i + 1; //update progress bar





            if (imageList[i] instanceof File) {


                fname = imageList[i].name.toLowerCase(); //convert file name to lowercase to check for supported formats


                if (fname.indexOf('.svg') == -1)


                {


                    win.pnl.errorList.text += 'Skipping ' + imageList[i].name + '. Not a supported type.\r'; //log error


                    continue; // skip unsupported formats


                } else {


                    sname = imageList[i].name.substring(0, imageList[i].name.lastIndexOf(".")); //discard file extension





                    // Check for duplicate symbol name;


                    if (symbolExists(activeDoc, sname)) {


                        win.pnl.errorList.text += 'Skipping ' + imageList[i].name + '. Duplicate symbol for name: ' + sname + '\r'; //log error


                    } else {


                        placedart = activeDoc.placedItems.add(); //get a reference to a new placedItem object


                        placedart.file = imageList[i]; //link the object to the image on disk


                        placedart.name = sname; //give the placed item a name


                        placedart.embed(); //make this a RasterItem





                        placedart = activeDoc.pageItems.getByName(sname); //get a reference to the newly created raster item


                        newsymbol = activeDoc.symbols.add(placedart); //add the raster item to the symbols                  


                        newsymbol.name = sname; //name the symbol





                        symbolcount++; //update the count of symbols created


                        placedart.remove(); //remove the raster item from the canvas





                        win.pnl.symbolCount.text = 'Symbols added: ' + symbolcount; //update created number of symbols indicator


                        win.pnl.symbolLabel.text = 'Last added symbol: ' + sname; //update created symbol indicator


                    }


                }


            } else {


                win.pnl.errorList.text += 'Skipping ' + imageList[i].name + '. Not a regular file.\r'; //log error


            }





            win.update(); //required so pop-up window content updates are shown


        }



        win.pnl.currentTaskLabel.text = ''; //clear current file indicator





        // Final verdict


        if (symbolcount > 0) {


            win.pnl.symbolLabel.text = 'Symbol library changed. Do not forget to save your work';


        } else {


            win.pnl.symbolLabel.text = 'No new symbols added to the library';


        }



        win.update(); //update window contents


        templayer.remove(); //remove the temporary layer


    } else {


        alert("Action cancelled by user");


    }


}


0

if (app.documents.length > 0) {


    importFolderContents(getFolder());


} else {


    Window.alert("You must open at least one document.");


}