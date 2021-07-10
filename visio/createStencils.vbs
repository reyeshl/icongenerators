Dim CurrentPathOfDoc As String
Dim AllInOnenewStancilFile As Visio.Document
Dim prefixdName As String
Dim inputFolder As String
Dim outputFolder As String


Sub listFolderAndFiles()
prefixdName = "AZ"
inputFolder = "\imagesToImport\"
outputFolder = "\outputStencil\"

Dim FSO As Scripting.FileSystemObject
Dim fsoRootFolder As Folder
Dim visioDoc As Visio.Document

CurrentPathOfDoc = Application.ActiveDocument.Path
Set FSO = New Scripting.FileSystemObject
Set fsoRootFolder = FSO.GetFolder(CurrentPathOfDoc & inputFolder)
Set AllInOnenewStancilFile = Application.Documents.AddEx(fsoRootFolder.Name, visMSDefault, visAddStencil + visOpenDocked)

Call readFolder(fsoRootFolder)

AllInOnenewStancilFile.SaveAsEx CurrentPathOfDoc & outputFolder & prefixdName & "All_.vssx", visAddStencil

End Sub


Function readFolder(inputFolder As Folder)

Dim newStencilFile As Visio.Document
Set newStencilFile = Application.Documents.AddEx(inputFolder.Name, visMSDefault, visAddStencil + visOpenDocked)

Call AddMasters(inputFolder, newStencilFile)


Dim tmpFolder As Folder
For Each tmpFolder In inputFolder.SubFolders
Debug.Print tmpFolder.Name
Call readFolder(tmpFolder)
Next

newStencilFile.SaveAsEx CurrentPathOfDoc & outputFolder & prefixdName & inputFolder.Name & ".vssx", visAddStencil

End Function





Function AddMasters(inputFolder As Folder, newStencilFile As Visio.Document)

Dim currentFile As File
Dim sanitizeMasterName As String
Dim FSO As Scripting.FileSystemObject

Set FSO = New Scripting.FileSystemObject

Dim vsoMasters As Visio.Masters
Dim vsoMaster As Visio.Master
Dim vsoMaster2 As Visio.Master

Dim extentionName As String
For Each currentFile In inputFolder.Files
extentionName = FSO.GetExtensionName(currentFile.Path)
Debug.Print currentFile.Name
If UCase(extentionName) = "SVG" Then

sanitizeMasterName = normalizeName(currentFile.Name)
Set vsoMaster = newStencilFile.Masters.Add
Set vsoMaster2 = AllInOnenewStancilFile.Masters.Add
vsoMaster.Import currentFile.Path
vsoMaster.Name = sanitizeMasterName
vsoMaster2.Import currentFile.Path
vsoMaster2.Name = inputFolder.Name & "_" & sanitizeMasterName

End If


Next



End Function



Function normalizeName(fileName As String) As String

Dim finalName As String
finalName = fileName

Dim myRegX As New RegExp

With myRegX
.Pattern = "(^[0-9]{5})(-icon-service-)"
End With

finalName = myRegX.Replace(fileName, "")

With myRegX
.Pattern = "(.svg)|(.SVG)"
End With

finalName = myRegX.Replace(fileName, "")
normalizeName = finalName

End Function



