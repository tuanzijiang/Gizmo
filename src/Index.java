import org.DBConnection;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Iterator;

public class Index extends HttpServlet {
    DBConnection dbConn = new DBConnection();
    Statement stmt = dbConn.getStatement();
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String command=(String) req.getParameter("command");
        String userId=(String) req.getParameter("userId");
        String sceneId=(String) req.getParameter("sceneId");
        String value;
        PrintWriter printWriter=resp.getWriter();
        switch (command){
            case "save":
                value = (String) req.getParameter("value");
                try {
                    ResultSet rs = stmt.executeQuery("select count(*) from data");
                    String i = Integer.toString(rs.getInt(1) + 1);
                    stmt.executeUpdate("insert into sceneData (userId,sceneId,configure) VALUES (\"" + userId + "\",\"" + i + "\",\"" + value + "\")");
                } catch (Exception e) {
                    e.printStackTrace();
                }
                printWriter.print("{\"resultCode\":true}");
                printWriter.close();
                break;
            case "open":
                ArrayList<String> scenes = new ArrayList<>();
                try{
                    ResultSet rs = stmt.executeQuery("select * from sceneData");
                    while (rs.next()) {
                        scenes.add(rs.getString(3));
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
                Iterator<String> it = scenes.iterator();
                String str = "[";
                while(it.hasNext()) {
                    str = str + "\"" + it.next() + "\",";
                }
                str = str.substring(0, str.length()-1) + "]";
                printWriter.print("{\"resultCode\":true,\"value\":" + str + "}");
                printWriter.close();
                break;
            case "read":
                String result = null;
                try {
                    ResultSet rs = stmt.executeQuery("select configure from sceneData where userId = " + userId + " and sceneId = " + sceneId);
                    while (rs.next()) {
                        if(result == null) {
                            result = rs.getString(1);
                        }
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
                printWriter.print("{\"resultCode\":true,\"value\":" + result + "}");
                printWriter.close();
                break;
            default:
                printWriter.print("456456");
                printWriter.close();
                break;
        }
    }
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doPost(req,resp);
    }
}