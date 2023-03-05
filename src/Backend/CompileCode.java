package src.Backend;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.lang.reflect.*;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.Scanner;
import java.io.StringWriter;


public class CompileCode {

    private String name; // name of the class to be compile

    public CompileCode(String name) {
        this.name = name;
    }

    private void start() {
        File f = new File("data/exported/Test");
        URLClassLoader urlcl = null;
        try{
        URL[] cp = {f.toURI().toURL()};
      urlcl = new URLClassLoader(cp);
        }catch(Exception e){
            e.printStackTrace();
        }
        
        
        try {
            Class<?> c = urlcl.loadClass("Test.java");
            Method m = c.getDeclaredMethod("main", String[].class);
            m.invoke(null, (Object) new String[] {});
        } catch (Exception e) {
            System.out.println("false\n");
            System.out.println(formatErrorString(e));
            //e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        File taskFile = new File("data/exported/task.txt");
        String mainMethod= "";
        Scanner sc = null;
        try {
            sc = new Scanner(taskFile);

            while (sc.hasNextLine()) {
                String line = sc.nextLine();

                if (line.contains("*main")) {
                    mainMethod = line.replace("*main", "");
                    mainMethod = mainMethod.replace(".java", "");
                    // mainMethod = "RunApp: " + mainMethod + ".class";
                    break;
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        // for testing: System.out.println(mainMethod);
        CompileCode c = new CompileCode(mainMethod);
        c.start();
        //TODO taskFile.delete();
    }
    public String formatErrorString(Exception e){
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);

        e.printStackTrace(pw);
        String message = sw.toString();
        int index = message.indexOf("Caused by: ");
        int index2 = message.indexOf("...");

        if (index >= 0){
            if (index2 != -1){
                message = message.substring(index, index2);
            } else {
                message = message.substring(index);
            }     
        }
               
        pw.close();
        return message;
    }
}