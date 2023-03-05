package src.Backend;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.lang.reflect.*;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.Scanner;
import javax.tools.ToolProvider;
import javax.tools.JavaCompiler;
import java.io.StringWriter;



public class CompileCode {

    private String name; // name of the class to be compile

    public CompileCode(String name) {
        this.name = name;
    }

    private void start() {
        
        try {
            
            File dirFile = new File("src/user/");
            
            String contents[] = dirFile.list();

            JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
            for(int i=0;i<contents.length;i++){
                if(contents[i].contains(".java")&&!contents[i].contains("CompileCode")){
                    compiler.run(null, null, null, "src/user/"+contents[i]);
                    //System.out.println("Compiling "+ contents[i]);
                }
            }
        
            URLClassLoader cs = new URLClassLoader(new URL[] {dirFile.toURI().toURL()});
            Class<?> c = cs.loadClass(name);
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
        CompileCode c = new CompileCode("src.user."+mainMethod);
        c.copyFiles();
        c.start();
        File dirFile = new File("src/user/");
        
        String contents[] = dirFile.list();
        for(int i=0;i<contents.length;i++){
                File f1 = new File("src/user/"+contents[i]);
                //f1.delete();
                //System.out.println("Deleting from user" + contents[i]);
        }
        
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

    public void copyFiles(){
        File dirFile = new File("data/exported/");
            
        String contents[] = dirFile.list();
        for(int i=0;i<contents.length;i++){
                File f1 = new File("data/exported/"+contents[i]);
                File f2 = new File("src/user/"+contents[i]);
                copyContentHelper(f1,f2);
                //f1.delete();
                //System.out.println("Deleting " + contents[i]);
        }
       
    }
     
    public void copyContentHelper(File a, File b)
    {
        FileInputStream in = null;
        FileOutputStream out = null;
        
  
        try {
            in = new FileInputStream(a);
            out = new FileOutputStream(b);
            int n;
            out.write("package src.user;\n".getBytes());
            
            // read() function to read the
            // byte of data
            while ((n = in.read()) != -1) {
                // write() function to write
                // the byte of data
                out.write(n);
            }
        }catch(Exception e){
            System.out.println(formatErrorString(e));
        }
        finally {
            try {
                if (in != null) {
                    // close() function to close the
                    // stream
                    in.close();
                }
                // close() function to close
                // the stream
                if (out != null) {
                    out.close();
                }
            } catch (Exception e) {
                System.out.println(formatErrorString(e));
            }      
        }
        //System.out.println("File Copied");
    }
}



