package src.Backend;
import java.io.*; import java.util.Scanner;

public class FileCreator {

    /**
     * Writes into a makefile based on instructions provided by task.txt
     * @param taskFile - the .txt file with a list of classes passed from frontend
     * @return
     */
    public void makeFile() {
        //Creates a makeFile
        File taskFile = new File("data/exported/task.txt");
        File makeFile = new File("makeFile.txt");

        try {
            boolean result = makeFile.createNewFile();
        } catch (IOException e) {
            e.printStackTrace();
        }

        writeFile(makeFile, taskFile);
    }

    public void writeFile(File makeFile, File taskFile) {
        String returnString = "";
        String mainMethod= "";
        Scanner sc = null;
        try {
            sc = new Scanner(taskFile);

            //Can use String.indent(4); for a tab

            while (sc.hasNextLine()) {
                String line = sc.nextLine().replaceFirst(".java", ""); // the class name

                if (line.contains("*main")) {
                    mainMethod = line.replace(" *main", "");
                    // mainMethod = "RunApp: " + mainMethod + ".class";
                    continue;
                }

                returnString += line + ".class: "+ line + ".java\n"; // adds .class
                returnString += "\t" + "javac "+ line+".java" + "\n\n";
            }

            PrintWriter pw = new PrintWriter(makeFile);
            String s = "runApp: "+ mainMethod+".class\n";
            s+="\t"+"java "+mainMethod+"\n\n";
            System.out.println(s);
            System.out.println(returnString);
            pw.write(s);
            pw.print(returnString);
            pw.close();

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
