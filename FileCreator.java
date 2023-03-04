import java.io.*; import java.util.Scanner;

public class FileCreator {

    /**
     * Writes into a makefile based on instructions provided by task.txt
     * @param name
     * @return
     */
    public String writeFile(File name) {
        //Creates a makeFile
        File makeFile = new File("makeFile.txt");
        File params = new File("exported" + File.separator + "task.txt");
        Scanner sc = null;

        try {
            boolean result = makeFile.createNewFile();
            sc = new Scanner(params);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    public String formatMake() {


    }



}
