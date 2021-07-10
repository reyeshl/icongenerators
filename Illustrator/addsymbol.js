function getFolder() {

    //return new  Folder('/c/Users/hugor/icons4Test');
    return Folder.selectDialog('Please select the folder to be imported:', Folder('/c/Users/hugor/icons4Test/Compute'));
}

function importFolderContents() 
{
    var activeDoc = app.activeDocument; //Active object reference

         var templayer = activeDoc.layers.add(); //Create a new temporary layer

        templayer.name = "Temporary layer"

        var newsymbol; //Symbol object reference

        var placedart; //PlacedItem object reference

        var fname; //File name

        var sname; //Symbol name 


        


var imageFile = new File('/c/Users/hugor/icons4Test/Compute/00398-icon-service-Disk-Encryption-Sets.ai')


        var symbolcount = 0; //Number of symbols added

                        placedart = activeDoc.placedItems.add(); //get a reference to a new placedItem object


                        placedart.file =   imageFile // new File('/c/Users/hugor/icons4Test/Compute/00398-icon-service-Disk-Encryption-Sets.ai');


                        sname = "hrlname333";
                        placedart.name = sname

                                                

                        placedart.embed(); //make this a RasterItem


                        var newImage;

                        newImage = activeDoc.pageItems.getByName(sname); //get a reference to the newly created raster item
                        



                        newsymbol = activeDoc.symbols.add(newImage); //add the raster item to the symbols                  


                        newsymbol.name = sname; //name the symbol


                        newsymbol.remove(); //remove the raster item from the canvas
                        



                    }




if (app.documents.length > 0) {

    importFolderContents();


} else {


    Window.alert("You must open at least one document.");


}