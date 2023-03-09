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

    private String name;

    /**
     * Constructor for CompileCode
     * 
     * @param name - the name of the class to be compiled
     */
    public CompileCode(String name) {
        this.name = name;
    }

    /**
     * Method that compiles and runs the code
     */
    private void start() {

        try {
            File dirFile = new File("src/user/");

            String contents[] = dirFile.list();

            JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
            for (int i = 0; i < contents.length; i++) {
                if (contents[i].contains(".java") && !contents[i].contains("CompileCode")) {
                    compiler.run(null, null, null, "src/user/" + contents[i]);
                    // System.out.println("Compiling "+ contents[i]);
                }
            }

            URLClassLoader cs = new URLClassLoader(new URL[] { dirFile.toURI().toURL() });
            Class<?> c = cs.loadClass(name);
            Method m = c.getDeclaredMethod("main", String[].class);
            m.invoke(null, (Object) new String[] {});
            cs.close();

        } catch (Exception e) {
            System.out.println("false\n");
            System.out.println(formatErrorString(e));
            // e.printStackTrace();
        }
    }

    /**
     * Driver method
     * 
     * @param args - command line arguments (not used)
     */
    public static void main(String[] args) {

        File taskFile = new File("data/exported/task.txt");
        String mainMethod = "";
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
        CompileCode c = new CompileCode("src.user." + mainMethod);
        c.copyFiles();
        c.start();
        File dirFile = new File("src/user/");

        String contents[] = dirFile.list();
        for (int i = 0; i < contents.length; i++) {
            File f1 = new File("src/user/" + contents[i]);
            // f1.delete();
            // System.out.println("Deleting from user" + contents[i]);
        }

    }

    /**
     * Method that formats the error string for the Node.js server to read
     * 
     * @param e the exception tossed
     * @return the formatted error string
     */
    public String formatErrorString(Exception e) {
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);

        e.printStackTrace(pw);
        String message = sw.toString();
        int index = message.indexOf("Caused by: ");
        int index2 = message.indexOf("...");

        if (index >= 0) {
            if (index2 != -1) {
                message = message.substring(index, index2);
            } else {
                message = message.substring(index);
            }
        }

        pw.close();

        return message;
    }

    /**
     * Method that copies the files from the exported folder to the user folder
     * 
     */
    public void copyFiles() {
        File dirFile = new File("data/exported/");

        String contents[] = dirFile.list();
        for (int i = 0; i < contents.length; i++) {
            File f1 = new File("data/exported/" + contents[i]);
            File f2 = new File("src/user/" + contents[i]);
            copyContentHelper(f1, f2);
            // f1.delete();
            // System.out.println("Deleting " + contents[i]); // for testing
        }

    }

    /**
     * Helper method that copies the content of the file from one file to another
     * 
     * @param a - file to copy from
     * @param b - file to copy to
     */
    public void copyContentHelper(File a, File b) {
        FileInputStream in = null;
        FileOutputStream out = null;

        try {
            in = new FileInputStream(a); // input stream
            out = new FileOutputStream(b); // output stream
            int n; // number of bytes read
            out.write("package src.user;\n".getBytes()); // write package name

            // read() function to read the byte of data
            while ((n = in.read()) != -1) {
                // write() function to write the byte of data
                out.write(n);
            }
        } catch (Exception e) {
            System.out.println(formatErrorString(e));
        } finally {
            try {
                if (in != null) {
                    // close() function to close input stream
                    in.close();
                }
                // close() function to close output stream
                if (out != null) {
                    out.close();
                }
            } catch (Exception e) {
                System.out.println(formatErrorString(e));
            }
        }
        // System.out.println("File Copied"); // for testing
    }
}
