


function main(){
  document.write("function start");

  var fso = new WScript.CreateObject("Scripting.FileSystemObject");
  document.write("cleate fso OK");
  //var allKashi = new FileReader();
  //allKashi.readAsTextFile("data/kashi_roma.txt");
  var allKashi = fso.OpenTextFile("data/kashi_roma.txt", 1);

  var line = allKashi.ReadLine();
  document.write("file road OK");
  document.write(line);

  allKashi.Close();
  document.write("finction end");
}
main();
