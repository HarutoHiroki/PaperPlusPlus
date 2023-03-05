package src.Backend;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.*;
import java.util.Scanner;

public class CompileCode {

    private String name; // name of the class to be compile

    public CompileCode(String name) {
        this.name = name;
    }

    private void start() {
        try {
            Class<?> c = Class.forName("src.Backend." + name);
            Method m = c.getDeclaredMethod("main", String[].class);
            m.invoke(null, (Object) new String[] {});
        } catch (Exception e) {
            System.out.println(false + "\n" + e.getCause());
        }
    }

    public static void main(String[] args) {
        File taskFile = new File("data/exported/task.txt");
        String mainMethod= "";
        Scanner sc = null;
        try {
            sc = new Scanner(taskFile);

            //Can use String.indent(4); for a tab

            while (sc.hasNextLine()) {
                String line = sc.nextLine();

                if (line.contains("*main")) {
                    mainMethod = line.replace(" *main", "");
                    mainMethod = mainMethod.replace(".java", "");
                    // mainMethod = "RunApp: " + mainMethod + ".class";
                    break;
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        System.out.println(mainMethod);
        CompileCode c = new CompileCode(mainMethod);
        c.start();
    }
}