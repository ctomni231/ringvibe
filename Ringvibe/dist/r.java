import java.applet.Applet;
import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Cursor;
import java.awt.Graphics2D;
import java.awt.event.MouseEvent;
import java.awt.image.BufferedImage;
import java.util.Random;
import java.awt.Font;

public class r extends Applet implements Runnable{

    private int mx;
    private int my;
    private boolean[] mouse = new boolean[4];

    @Override
    public void start() {
    	Cursor crossHairCursor = new Cursor(Cursor.CROSSHAIR_CURSOR); 
    	setCursor(crossHairCursor); 
        enableEvents(16);
        new Thread(this).start();
    }

    public void run() {
        BufferedImage image = new BufferedImage(80*10, 60*10, 1);
        Graphics2D g = (Graphics2D)image.getGraphics();
        Graphics2D g2 = null;
        g.setFont(new Font("sansserif", Font.BOLD, 32));
        String l = "LEFT CLICK RINGS";
        String r = "RIGHT CLICK BANG";      
        Random rand = new Random();
        int[] rg = new int[127];
        int[] rposx = new int[127];
        int[] rposy = new int[127];
        int[] ract = new int[127];
        int[] ex = new int[127];
        Color bg = Color.BLACK;
        int i = 0;
        int j = 0;
        int k = 0;

        for(i = 0; i < 127; i++){
            rg[i] = 0;
            ex[i] = -1;
            j = -1;
        }
       
        while(true){      	
        	if(rg[7] <= 0){
        		if(j < 0){
        			for(i = 0; i < 127; i++){
        				ract[i] = (i < 6) ? i : -1;
        	            rposx[i] = (i < 6) ? 130+100*i : -1;
        	            rposy[i] = (i < 6) ? 30*10 : -1;
        			}
        			j = 0;
        		}
        		rg[9] = 500;
                rg[11] = rg[9];
                if(mouse[3] && rg[12] == 0){
                	bg = new Color(rand.nextInt(127*2), rand.nextInt(127*2), rand.nextInt(127*2));
                	mouse[3] = false;
                }
                
                g.setColor(Color.BLACK);
                g.drawString("RINGVIBE", 320-1, 150-1);
                g.drawString((rg[12] == 0 ? l : r), 250-1, 550-1);
                g.setColor(Color.WHITE);
                g.drawString("RINGVIBE", 320+1, 150+1);
                g.drawString((rg[12] == 0 ? l : r), 250+1, 550+1);
                g.setColor(Color.GRAY);
                g.drawString("RINGVIBE", 320, 150);
                g.drawString((rg[12] == 0 ? l : r), 250, 550);
        	}
        		
            k -= (rg[0] + rg[1])/2 == 0 ? 1 : (rg[0] + rg[1])/2;
            if(k >= 360 || k <= -360)
                k += (k >= 360 ? -360 : 360);
            
            for(i = 0; i < 127; i++){
            	if(ract[i] == -1){
            		rg[4] = rand.nextInt(10*60)-(30*10);
            		if(rg[1] != 0 && rg[4] >= 0){
            			if(rg[4] < 20){
            				ract[i] = rand.nextInt(6);
            				rposx[i] = rg[4]*40;
            				rposy[i] = rg[1] > 0 ? -100 : 70*10;
            			}
            		}else if(rg[0] != 0 && rg[4] < 0){
            			if(rg[4] > -15){
            				ract[i] = rand.nextInt(6);
            				rposx[i] = rg[0] > 0 ? -100 : 90*10;
            				rposy[i] = (-rg[4]*40)+1;
            			}
            		}
            		break;
            	}
            }         	
            
            //wind change sequence
            if(rg[2] == 0 && rg[3] == 0){
            	rg[2] = rand.nextInt(11)-6;
            	rg[3] = rand.nextInt(11)-6;
            	rg[6] = 0;
            }
            //game sequence
            if(rg[7] != 0){
	            rg[6]++;
	            if(rg[6]%25 == 0){
	            	if(rg[0] != rg[2])
	            		rg[0] += (rg[0] < rg[2] ? 1 : -1);
	            	if(rg[1] != rg[3])
	            		rg[1] += (rg[1] < rg[3] ? 1 : -1);
	            	rg[9] -= rg[17];
	            	if(rg[12] < 1)
	            		rg[11] -= rg[17];
	            }
	            if(rg[6] > 1000){
	            	rg[2] = 0;
	            	rg[3] = 0;
	            	rg[17]++;
	            }
	            rg[9] -= rg[12];
	            if(rg[12] > 0)
	            	rg[11] -= 1;
            }      	
            
            //explosion render sequence
            for(i = 0; i < 127-3; i+=4){
        		if(ex[i] >= 0){
        			if(ex[i]%6 == 0)
                        g.setColor(new Color(127*2,0,0));
                    else if(ex[i]%6 == 1)
                        g.setColor(new Color(127*2,172,0));
                    else if(ex[i]%6 == 2)
                        g.setColor(new Color(127*2,127*2,0));
                    else if(ex[i]%6 == 3)
                        g.setColor(new Color(0,127*2,0));
                    else if(ex[i]%6 == 4)
                        g.setColor(new Color(0,0,127*2));
                    else if(ex[i]%6 == 5)
                        g.setColor(new Color(127*2,0,127*2));
        			g.fillOval(ex[i+1]+ex[i+3], ex[i+2], 7, 7);
        			g.fillOval(ex[i+1]+ex[i+3], ex[i+2]-ex[i+3], 7, 7);
        			g.fillOval(ex[i+1], ex[i+2]-ex[i+3], 7, 7);
        			g.fillOval(ex[i+1]-ex[i+3], ex[i+2]-ex[i+3], 7, 7);
        			g.fillOval(ex[i+1]-ex[i+3], ex[i+2], 7, 7);
        			g.fillOval(ex[i+1]-ex[i+3], ex[i+2]+ex[i+3], 7, 7);
        			g.fillOval(ex[i+1], ex[i+2]+ex[i+3], 7, 7);
        			g.fillOval(ex[i+1]+ex[i+3], ex[i+2]+ex[i+3], 7, 7);
        			ex[i+3]+=7;
        			if(ex[i+3] > 85*10){
        				ex[i] = -1;
        				ex[i+1] = -1;
        				ex[i+2] = -1;
        				ex[i+3] = -1;
        			}
        		}
        	}
            
            for(i = 0; i < 127; i++){
            	//ring update sequence
            	if(mouse[1] && ract[i]%12 < 6){
            		if(rposx[i]-10 < mx && rposx[i]+60 > mx && rposy[i]-10 < my && rposy[i]+60 > my){
            			rg[8] += (ract[i]%6+1)*10;
            			rg[10] += (7-(ract[i]%6+1))*10;
            			ract[i]+=6;
            			if(rg[13] == rg[12]){
            				for(j = 0; j < 127-3; j+=4){
                    			if(ex[j] == -1){
                    				ex[j] = ract[i];
                    				ex[j+1] = rposx[i]+17;
                    				ex[j+2] = rposy[i]+17;
                    				ex[j+3] = 0;
                    				break;
                    			}
                    		}
            			}
            			rg[12]++;
            		}
            	}else if(mouse[3] && ract[i]%12 > 5){
            		for(j = 0; j < 127-3; j+=4){
            			if(ex[j] == -1){
            				ex[j] = ract[i];
            				ex[j+1] = rposx[i]+17;
            				ex[j+2] = rposy[i]+17;
            				ex[j+3] = 0;
            				break;
            			}
            		}
            		rg[7] += rg[8];
            		rg[9] += rg[10];
            		rg[11] += rg[10];
        			rg[8] = 0;
            		rg[10] = 0;
            		//the line to change
            		if(rg[13] == rg[12])
            			rg[9] = rg[11];
            		else
            			rg[11] = rg[9];
            		rg[12] = 0;
            		rg[13] = 0;
            		ract[i] = -1;
            		rposx[i] = -100;
            	}
            	
            	//ring render sequence
                if(ract[i] >= 0){
                	g.setStroke(new BasicStroke(12));
        			g.setColor(Color.BLACK);
        			g.drawOval(rposx[i]+2, rposy[i]+2, 36, 36);
        			g.setStroke(new BasicStroke(8));
        			if(ract[i]%6 == 0)
                        g.setColor(new Color(127*2,0,0));
                    else if(ract[i]%6 == 1)
                        g.setColor(new Color(127*2,172,0));
                    else if(ract[i]%6 == 2)
                        g.setColor(new Color(127*2,127*2,0));
                    else if(ract[i]%6 == 3)
                        g.setColor(new Color(0,127*2,0));
                    else if(ract[i]%6 == 4)
                        g.setColor(new Color(0,0,127*2));
                    else if(ract[i]%6 == 5)
                        g.setColor(new Color(127*2,0,127*2));
        			g.drawOval(rposx[i]+2, rposy[i]+2, 36, 36);
        			g.setColor(Color.WHITE);
                    g.drawArc(rposx[i]+2, rposy[i]+2, 36, 36, k%(60*6), 20);
                    g.drawArc(rposx[i]+2, rposy[i]+2, 36, 36, k+90%(60*6), 20);
                    g.drawArc(rposx[i]+2, rposy[i]+2, 36, 36, k+180%(60*6), 20);
                    g.drawArc(rposx[i]+2, rposy[i]+2, 36, 36, k+270%(60*6), 20);
                    g.setStroke(new BasicStroke(1));
                    g.setColor(Color.BLACK);
                    g.drawOval(rposx[i]-3, rposy[i]-3, 45, 45);
                    g.drawOval(rposx[i]+6, rposy[i]+6, 27, 27);
                    
                    //selector render sequence
                    if(ract[i]%12 > 5){
                    	g.setColor(Color.DARK_GRAY);
                    	g.drawLine(rposx[i]-10, rposy[i]-10, rposx[i]+15, rposy[i]-10);
                    	g.drawLine(rposx[i]-10, rposy[i]-10, rposx[i]-10, rposy[i]+15);
                    	g.drawLine(rposx[i]+47, rposy[i]+47, rposx[i]+27, rposy[i]+47);
                    	g.drawLine(rposx[i]+47, rposy[i]+47, rposx[i]+47, rposy[i]+27);
                    	g.drawLine(rposx[i]-7, rposy[i]-7, rposx[i]+12, rposy[i]-7);
                    	g.drawLine(rposx[i]-7, rposy[i]-7, rposx[i]-7, rposy[i]+12);
                    	g.drawLine(rposx[i]+50, rposy[i]+50, rposx[i]+24, rposy[i]+50);
                    	g.drawLine(rposx[i]+50, rposy[i]+50, rposx[i]+50, rposy[i]+24);
                    	g.setColor(Color.LIGHT_GRAY);
                    	g.drawLine(rposx[i]-8, rposy[i]-8, rposx[i]+13, rposy[i]-8);
                    	g.drawLine(rposx[i]-8, rposy[i]-8, rposx[i]-8, rposy[i]+13);
                    	g.drawLine(rposx[i]+49, rposy[i]+49, rposx[i]+25, rposy[i]+49);
                    	g.drawLine(rposx[i]+49, rposy[i]+49, rposx[i]+49, rposy[i]+25);
                    	g.drawLine(rposx[i]-9, rposy[i]-9, rposx[i]+14, rposy[i]-9);
                    	g.drawLine(rposx[i]-9, rposy[i]-9, rposx[i]-9, rposy[i]+14);
                    	g.drawLine(rposx[i]+48, rposy[i]+48, rposx[i]+26, rposy[i]+48);
                    	g.drawLine(rposx[i]+48, rposy[i]+48, rposx[i]+48, rposy[i]+26);
                    }  
                }
                
                if(ract[i]%12 < 6){
                	rposx[i]+=rg[0];
                	rposy[i]+=rg[1];
                }
            	
            	if(rposx[i] < -127 || rposx[i] > 127*8 || rposy[i] < -127 || rposy[i] > 127*6)
            		ract[i] = -1;
            }
            if(mouse[1] && rg[12] > 0){
            	rg[13] += (rg[12] <= rg[13]) ? 10 :(rg[12] - rg[13]);
            	mouse[1] = false;
            }
            
            
            //HUD graphics
            g.setColor(Color.LIGHT_GRAY);
            g.fill3DRect(0, 0, 80*10, 40, true);
            
            //Time    
            g.setColor(Color.LIGHT_GRAY);
            g.fill3DRect(5, 5, 80*10-10, 30, false);
            for(i = 1000, j = 0; i <= rg[9]; i*=2, j++);
            if(i >= rg[15]){
            	rg[15] = i;
                rg[14] = j;
            }            
            if(rg[14]%6 == 0)
            	g.setColor(new Color(127*2,0,127*2,127));
            else if(rg[14]%6 == 1)
            	g.setColor(new Color(0,0,127*2,127));
            else if(rg[14]%6 == 2)
            	g.setColor(new Color(0,127*2,0,127));
            else if(rg[14]%6 == 3)
            	g.setColor(new Color(127*2,127*2,0,127));
            else if(rg[14]%6 == 4)
            	g.setColor(new Color(127*2,172,0,127));
            else if(rg[14]%6 == 5)
            	g.setColor(new Color(127*2,0,0,127));
            g.fillRect(5, 5, (rg[9]*780)/rg[15], 30-1); 
            if(rg[12] == rg[13])
            	g.fillRect(5, 5, (rg[11]*780)/rg[15], 30-1); 
            
            //Score
            for(i = 1, j = 0; i <= rg[rg[7] > 0 ? 7 : 18]; i*=10, j++);
            g.setColor(Color.BLACK);
            g.drawString(String.valueOf(rg[rg[7] > 0 ? 7 : 18]), 98*4-(6*j)+1, 30+2);
            g.setColor(Color.YELLOW);
            if(rg[16] == 0 || rg[7] < rg[16])
            	g.setColor(Color.WHITE);
            g.drawString(String.valueOf(rg[rg[7] > 0 ? 7 : 18]), 98*4-(6*j), 30+1);
            
            
            //High Score
            if(rg[16] > 0 && rg[18] <= rg[16]){
		        for(i = 1, j = 0; i <= rg[16]; i*=10, j++);
		        g.setColor(Color.BLACK);
		        g.drawString(String.valueOf(rg[16]), 98*4-(6*j)+1, 70+2);
		        g.setColor(Color.GRAY);
		        g.drawString(String.valueOf(rg[16]), 98*4-(6*j)+1, 70);
	            g.setColor(Color.YELLOW);
	            g.drawString(String.valueOf(rg[16]), 98*4-(6*j), 70+1);
	            if(rg[7] > rg[16]){
	            	for(i = 0, j = 0; j < 127-3; j+=4){
            			if(ex[j] == -1){
            				ex[j] = 2;
            				ex[j+1] = 98*4;
            				ex[j+2] = 70+1;
            				ex[j+3] = 0;
            			}
            		}
	            	rg[18] = rg[16]+1;
	            }
            }
            
            if(rg[9] < 0 && (rg[12] != rg[13] || rg[11] <= 0)){
            	if(rg[16] < rg[7])
            		rg[16] = rg[7]; 
            	rg[18] = rg[7];
            	for(i = 0; i < 127; i++){
            		for(j = 0; j < 127-3; j+=4){
            			if(ex[j] == -1){
            				ex[j] = ract[i];
            				ex[j+1] = rposx[i]+17;
            				ex[j+2] = rposy[i]+17;
            				ex[j+3] = 0;
            				ract[i] = -1;
            				break;
            			}
            		}
            		if(i != 16 && i != 18)
            			rg[i] = 0;
            	}   	
            	j = -1;
            }
            
             
            if(g2 == null){
                g2 = (Graphics2D)getGraphics();
                requestFocus();
            }else
                g2.drawImage(image, 0, 0, 80*10, 60*10, null);
            
            g.setColor(bg);
            g.fillRect(0, 0, 80*10, 60*10);         
            
            try {
                Thread.sleep(10);
            } catch (InterruptedException e) {
            }
            
            //if(!isActive) return;
        }
    }

    @Override
    protected void processMouseEvent(MouseEvent e) {
        mx = e.getX();
        my = e.getY();
        mouse = new boolean[]{false, false, false, false};
        mouse[e.getButton()] = (e.getID() == MouseEvent.MOUSE_PRESSED);
    }

    // to run in window, uncomment below
    public static void main(String[] args) throws Throwable {
        javax.swing.JFrame frame = new javax.swing.JFrame("Ringvibe");
        frame.setDefaultCloseOperation(javax.swing.JFrame.EXIT_ON_CLOSE);
        r applet = new r();
        applet.setPreferredSize(new java.awt.Dimension(800, 600));
        frame.add(applet, java.awt.BorderLayout.CENTER);
        frame.setResizable(false);
        frame.pack();
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);
        Thread.sleep(250);
        applet.start();
    }//*/
}
