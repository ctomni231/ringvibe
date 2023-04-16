import java.applet.Applet;
import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.event.MouseEvent;
import java.awt.image.BufferedImage;
import java.util.Random;

//TODO: Pause :D
public class b extends Applet implements Runnable{
	
	private int mx, my;
    private boolean[] mb = new boolean[4];
    private Graphics2D g, g2;
    
    @Override
    public void start() {
    	setCursor(new java.awt.Cursor(1)); 
        enableEvents(16);
        new Thread(this).start();
    }
    
	@Override
	public void run() {	
		Random rd = new Random();
		BufferedImage image = new BufferedImage(80*10, 60*10, 1);
		g = (Graphics2D)image.getGraphics();
		int[] rg = new int[127], ra = new int[127], rx = new int[127], ry = new int[127], ex = new int[127];
        int i,j,k = 0;      
            
        for(i = 0; i < 127; i++)    	
        	ex[i] = rg[i] = 0;  
        rg[7] = -1;
        
        while(true){
        	if(rg[7] <= 0){
        		if(rg[7] < 0){       			
        			for(i = 0; i < 127; i++){
        				if(ra[i] > 0)
        					ra[i]*=-1;
        				for(j = 0; j < 124; j+=4){
    						if(ex[j] == 0){
    							ex[j] = ra[i];
    							ex[j+1] = rx[i]+17;
    							ex[j+2] = ry[i]+17;
    							break;
    						}
    					} 
        				if(i != 16 && i != 17 && i != 20)
                			rg[i] = 0;
        				ra[i] = i < 6 ? i+1 : 0;//+6*(i+1) : for multi-powerups
        			}   
        			rx[1] = rx[4] = ry[3] = ry[5] = 37*10;
        			rg[9] = rg[11] = 50*10;//Time	
        			rx[0] = rx[5] = 25*10;
        			rx[2] = rx[3] = 49*10;
        			ry[0] = ry[2] = 19*10;
        			ry[4] = 43*10;
        			ry[1] = 13*10;	     			
        			rg[23] = 1;
        		}
            	//LIGHT_GRAY, ORANGE, GRAY
        		g.setColor(rg[20] >= 12 ? new Color(96*2, 96*2, 96*2) : 
        			rg[20] >= 6 ? new Color(127*2, 100*2, 0) : new Color(127, 127, 127));
            	if(rg[20] >= 6)//Need about 42 bytes to drop this in.
            		draw(rg[20] >= 12 ? "LEGEND" : "MASTER", 33*10, 35*10, 5);
            	draw("RINGVIBE", 14*10, 53*5, 15);
        		draw(rg[12] == 0 ? "LEFT CLICK : SELECT RINGS" : "RIGHT CLICK : DESTROY ALL", 13*10, 55*10, 5);
        	}       	
        	
        	//ring spin
        	k = k%(36*10);
        	k -= (rg[0] + rg[1])/2 == 0 ? (rg[0] + rg[1] < 0 ? -1 : 1) : (rg[0] + rg[1])/2;
        	   	
        	//ring creation sequence
        	for(i = 0; i < 127; i++){
            	if(ra[i] == 0){
            		rg[4] = rd.nextInt(10*60)-(30*10);
            		if(rg[1] != 0 && rg[4] >= 0 && rg[4] < 20){
            			ra[i] = rd.nextInt(6)+1;
            			rx[i] = rg[4]*40;
            			ry[i] = rg[1] > 0 ? -100 : 70*10;
            		}else if(rg[0] != 0 && rg[4] > -15 && rg[4] < 0){
            			ra[i] = rd.nextInt(6)+1;
            			rx[i] = rg[0] > 0 ? -100 : 90*10;
            			ry[i] = (-rg[4]*40)+1;
            		}
            		rg[4] = rd.nextInt(120);
            		if(ra[i] != 0 && rg[4] <= rg[14])
            			ra[i] += 6*(rg[4]%7);
            		break;
            	}
            }  
        	
        	//wind change sequence
            if(rg[2] == 0 && rg[3] == 0){
            	rg[2] = rd.nextInt(11)-6;
            	rg[3] = rd.nextInt(11)-6;
            	rg[6] = 0;
            }
            
            //game sequence
            if(rg[7] != 0){
	            if(rg[6]++%25 == 0){
	            	if(rg[0] != rg[2])
	            		rg[0] += (rg[0] < rg[2] ? 1 : -1);
	            	if(rg[1] != rg[3])
	            		rg[1] += (rg[1] < rg[3] ? 1 : -1);
	            	rg[9] -= rg[5];
	            	if(rg[12] <= 0)
	            		rg[11] -= rg[5];
	            	if(rg[18] != 0){
	            		rg[7] += 10;
	            		rg[18] -= 10;
	            	}
	            	if(rg[19] != 0){
	            		rg[9] += 10;
	            		rg[11] += 10;
	            		rg[19] -= 10;
	            	}
	            }
	            if(rg[6] > 10*100){
	            	rg[2] = rg[3] = 0;
	            	rg[5]++;
	            }	            
	            rg[9] -= rg[12];
	            if(rg[25] > 100)
	        		rg[9] = rg[11] = -1;
	            if(rg[12] > 0)
	            	rg[11] -= 1;	           
            }
            
            //Power-up Statistics
            for(i = 0; i < 2; i++){
            	g.setColor(new Color(0, 127*2, i == 0 ? 0 : 127*2));//GREEN, CYAN
            	if(rg[18+i] != 0)
            		draw(i == 0 ? "SCOREREEL" : "TIMEREEL", 10, 102+40*i, 2);
            	if(rg[18+i] > 0){
        			draw(String.valueOf(313*32), 10, 80+40*i, -4);
        			draw(String.valueOf(rg[18+i]), 25, 80+40*i, 4);
        		}          	
            }
            if(rg[24] == 1)
            	g.setColor(new Color(0, 127*2, 0));
            if(rg[24] != 0)
            	draw(rg[24] == 1 ? "SCOREBOMB" : "TIMECLEAR", 29*10, 49*10, 5);
                   	
        	//explosion render sequence
            for(i = 0; i < 124; i+=4){
        		if(ex[i] < 0){
        			if(ex[i]%6 == -1)
                        g.setColor(new Color(127*2,0,0));
                    else if(ex[i]%6 == -2)
                        g.setColor(new Color(127*2,172,0));
                    else if(ex[i]%6 == -3)
                        g.setColor(new Color(127*2,127*2,0));
                    else if(ex[i]%6 == -4)
                        g.setColor(new Color(0,127*2,0));
                    else if(ex[i]%6 == -5)
                        g.setColor(new Color(0,0,127*2));
                    else if(ex[i]%6 == 0)
                        g.setColor(new Color(127*2,0,127*2));
        			g.fillOval(ex[i+1], ex[i+2]-ex[i+3], 7, 7);
        			g.fillOval(ex[i+1]-ex[i+3], ex[i+2]-ex[i+3], 7, 7);
        			g.fillOval(ex[i+1], ex[i+2]+ex[i+3], 7, 7);
        			g.fillOval(ex[i+1]-ex[i+3], ex[i+2]+ex[i+3], 7, 7);
        			g.fillOval(ex[i+1]+ex[i+3], ex[i+2], 7, 7);  
        			g.fillOval(ex[i+1]+ex[i+3], ex[i+2]-ex[i+3], 7, 7);
        			g.fillOval(ex[i+1]-ex[i+3], ex[i+2], 7, 7);      			
        			g.fillOval(ex[i+1]+ex[i+3], ex[i+2]+ex[i+3], 7, 7);
        			if((ex[i+3]+=7) > 80*10)
        				ex[i] = ex[i+3] = 0;
        		}
        	}
            
            //Last resort
        	for(i = 0; i < 127; i++){
        		if(mb[3] && rg[24] != 0 && ra[i] > 0){
        			rg[26]++;//for shaking
        			rg[8] += 70;
        			ra[i] *= -1;
        		}
        	}      	
        	
        	for(i = 0; i < 127; i++){        		            		
        		//ring render sequence
        		if(ra[i] != 0){
                	g.setStroke(new BasicStroke(12));
        			g.setColor(new Color(0));//BLACK
        			g.drawOval(rx[i]+2, ry[i]+2, 36, 36);
        			g.setStroke(new BasicStroke(8));
        			if(ra[i]%6 == 1 || -ra[i]%6 == 1)
                        g.setColor(new Color(127*2,0,0));
                    else if(ra[i]%6 == 2 || -ra[i]%6 == 2)
                        g.setColor(new Color(127*2,172,0));
                    else if(ra[i]%6 == 3 || -ra[i]%6 == 3)
                        g.setColor(new Color(127*2,127*2,0));
                    else if(ra[i]%6 == 4 || -ra[i]%6 == 4)
                        g.setColor(new Color(0,127*2,0));
                    else if(ra[i]%6 == 5 || -ra[i]%6 == 5)
                        g.setColor(new Color(0,0,127*2));
                    else if(ra[i]%6 == 0)
                        g.setColor(new Color(127*2,0,127*2));
        			g.drawOval(rx[i]+2, ry[i]+2, 36, 36);
        			g.setColor(new Color(127*2, 127*2, 127*2));//WHITE
        			for(j = 0; j < 4; j++)
        				g.drawArc(rx[i]+2, ry[i]+2, 36, 36, (k+90*j)%(60*6), 20);
                    g.setStroke(new BasicStroke(1));
                	//Touch-up
                    g.setColor(new Color(0));//BLACK
                    g.drawOval(rx[i]-3, ry[i]-3, 45, 45);
                    g.drawOval(rx[i]+6, ry[i]+6, 27, 27); 
                    //Power-up render sequence
                    for(j = 0; j < 2; j++){//added color
                    	if(ra[i] > 30){
                    		draw(String.valueOf(ra[i] > 36 ? 8409688 : 34829074), rx[i]+14-j, ry[i]+14-j, -2);
                        	draw(String.valueOf(ra[i] > 36 ? 3421251 : 38172226), rx[i]+22-j, ry[i]+14-j, -2);
                    	}else if(ra[i] > 18){
                    		draw(String.valueOf(ra[i] > 24 ? 103874870 : 8409688), rx[i]+14-j, ry[i]+14-j, -2);
                        	draw(String.valueOf(ra[i] > 24 ? 56886371 : 7414851), rx[i]+22-j, ry[i]+14-j, -2);
                    	}else if(ra[i] > 6){
                    		draw(String.valueOf(ra[i] > 12 ? 15877167 : 147207880), rx[i]+14-j, ry[i]+14-j, -2);
                        	draw(String.valueOf(ra[i] > 12 ? 7475495 : 1270544), rx[i]+22-j, ry[i]+14-j, -2);
                    	}
                    	g.setColor(new Color(127*2, 127*2, 127*2));
                    }
                    
                    if(ra[i] > 0){
                    	//ring select sequence
                    	if(mb[1] && rx[i]-10 < mx && rx[i]+60 > mx && ry[i]-10 < my && ry[i]+60 > my){
	            			if(rg[21] > 0)
	            				rg[18] += (10+10*(rg[5]/10))*rg[21];
	            			if(rg[22] > 0)
	            				rg[19] += (10+10*(rg[5]/10))*rg[22];
	            			if(ra[i] > 36)
	            				rg[23] *= 3;
	            			else if(ra[i] > 24){
	            				rg[24] = ra[i] > 30 ? -1 : 1;
	            				rg[ra[i] > 30 ? 19 : 18] *= 2;
	            			}else if(ra[i] > 18)
	            				rg[23] *= 2;
	            			else if(ra[i] > 6){
	            				rg[ra[i] > 12 ? 19 : 18] += 100+10*rg[5];
	            				rg[ra[i] > 12 ? 22 : 21] += 1;
	            			}
	            			rg[8] += ((ra[i]-1)%6+1)*10;
	            			rg[10] += (6-((ra[i]-1)%6))*10;
	            			rg[27] += 1 << (6-((ra[i]-1)%6))/2*8;
	            			ra[i]*=-1;
	            			rg[12]++;
	            		}
                    	rx[i]+=rg[0];
                		ry[i]+=rg[1];
                    }else{
                    	//ring explosion sequence
                    	if(mb[3]){
                    		for(j = 0; j < 124; j+=4){
                    			if(ex[j] == 0){
                    				ex[j] = ra[i];
                    				ex[j+1] = rx[i]+17;
                    				ex[j+2] = ry[i]+17;
                    				break;
                    			}
                    		}
                			if(rg[24] >= 0)
                				rg[7] += (rg[8] + (rg[24] == 0 ? 0 : rg[10]))*rg[23];
                			if(rg[24] <= 0){
                				rg[9] += (rg[10] + (rg[24] == 0 ? 0 : rg[8]))*rg[23];
                            	rg[11] += (rg[10] + (rg[24] == 0 ? 0 : rg[8]))*rg[23];
                			}
                				
                    		//the line to change
                    		if(rg[13] == rg[12])
                    			rg[9] = rg[11];
                    		else
                    			rg[11] = rg[9];
                    		rg[23] = 1;
                    		rg[8] = rg[10] = rg[12] = rg[13] = rg[21] = rg[22] = rg[24] = rg[25] = ra[i] = 0;
                    	}
                    	//selector render sequence
                    	for(j = 0; j < 2; j++){
                    		g.setColor(new Color(65+j*127, 65+j*127, 65+j*127));//DARK,LIGHT GRAY
                    		g.drawLine(rx[i]-10+2*j, ry[i]-10+2*j, rx[i]+15-2*j, ry[i]-10+2*j);
                        	g.drawLine(rx[i]-10+2*j, ry[i]-10+2*j, rx[i]-10+2*j, ry[i]+15-2*j);
                        	g.drawLine(rx[i]+47+2*j, ry[i]+47+2*j, rx[i]+27-2*j, ry[i]+47+2*j);
                        	g.drawLine(rx[i]+47+2*j, ry[i]+47+2*j, rx[i]+47+2*j, ry[i]+27-2*j);
                        	g.drawLine(rx[i]-7-2*j, ry[i]-7-2*j, rx[i]+12+2*j, ry[i]-7-2*j);
                        	g.drawLine(rx[i]-7-2*j, ry[i]-7-2*j, rx[i]-7-2*j, ry[i]+12+2*j);
                        	g.drawLine(rx[i]+50-2*j, ry[i]+50-2*j, rx[i]+24+2*j, ry[i]+50-2*j);
                        	g.drawLine(rx[i]+50-2*j, ry[i]+50-2*j, rx[i]+50-2*j, ry[i]+24+2*j);
                    	}
                    }
                    if(rx[i] < -127 || rx[i] > 127*8 || ry[i] < -127 || ry[i] > 127*6)
                		ra[i] = 0;
        		}           	
        	}      	
        	if(mb[1] && rg[12] > 0){
            	rg[13] += (rg[12] <= rg[13]) ? 10 : rg[12] - rg[13];
            	mb[1] = false;
            }
        	if(mb[3] && my < 40)
        		rg[25]++;       	
        	
        	//HUD graphics WHITE, YELLOW, LIGHT_GRAY
            g.setColor(rg[14] >= 6 ? new Color(127*2, 127*2, rg[14] >= 12 ? 127*2 : 0) : new Color(96*2, 96*2, 96*2));
            g.fill3DRect(0, 0, 80*10, 40, true);
            
            //Time    
            g.fill3DRect(5, 5, 79*10, 30, false);
            for(i = 100*10, j = 0; i <= rg[9]; i*=2, j++);
            if(i > rg[15]){
            	rg[27] = 0;
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
            for(i = 0; i < 2; i++){
            	g.fill3DRect(5, 5, (rg[9+2*i]*79*10)/rg[15], 30, true);//3D rect change
            	if(rg[7] > 0){
            		draw("LEVEL", 70*10, 58*10, 3);
            		draw(String.valueOf(rg[14]+1), 77*10, 58*10, 3);
            	}
                if(rg[12] > 1){
        			draw("X   LINK", 10, 50, 5);
            		draw(String.valueOf(rg[12]), 30, 50, 5);
                }
                if(rg[23] > 1){
        			draw("X    CHAIN", 28*10, 52*10, 5);
            		draw(String.valueOf(rg[23]), 30*10, 52*10, 5);
                }
                if(rg[12] != rg[13])
                	break;
            }
            
            //Score
            for(i = 1, j = 0; i <= rg[rg[7] > 0 ? 7 : 17]; i*=10, j++);
            g.setColor(new Color(0));//BLACK
            draw(String.valueOf(rg[rg[7] > 0 ? 7 : 17]), 39*10-(10*j)+2, 8, 5);
            g.setColor(new Color(127*2, 127*2, rg[7] > rg[16] && rg[16] != 0 ? 0 : 127*2));//YELLOW,WHITE
            draw(String.valueOf(rg[rg[7] > 0 ? 7 : 17]), 39*10-(10*j)+1, 7, 5);
            
            //High Score
            if(rg[16] > 0 && rg[17] <= rg[16]){
		        for(i = 1, j = 0; i <= rg[16]; i*=10, j++);
	            g.setColor(new Color(127*2,100*2,0));//ORANGE
	            draw(String.valueOf(rg[16]), 39*10-(10*j)+1, 47, 5);
	            if(rg[7] > rg[16])
	            	rg[17] = rg[16]+1;
            }
            
            //Lose Sequence
            if(rg[9] < 0 && (rg[12] != rg[13] || rg[11] <= 0)){
            	if(rg[16] < rg[7])
            		rg[16] = rg[7];
            	rg[17] = rg[7];
            	rg[7] = -1;
            	rg[20] = rg[14];          	
            }        
        	
        	if(g2 == null){
                g2 = (Graphics2D)getGraphics();
                requestFocus();
            }else
            	g2.drawImage(image, 0, rg[26]/(rg[26]%2 == 0 ? 2 : -2), 80*10, 60*10, null);//Added Shake
            if(rg[26] > 0)//Added shake
            	rg[26]--;//Added shake
            
        	g.setColor(new Color(rg[27]));//Added color
            g.fill3DRect(0, 0, 80*10, 60*10, false);//3D rect change        
            
            try {
                Thread.sleep(10);
            } catch (Exception e) {
            }
            
            if(!isActive())
            	return;
        }
	}
	
	private void draw(String v, int px, int py, int sz){
		int[] l = new int[]{
			43,93,99,49,56,49,43,55,43,49, 0,63,49,92,49,98, 7,43,63,46, 0,61,98,63,63,43, 7, 0,62,49,27, 0,15, 0, 2, 49, 0,
		    25,49,24,52,10,53,39,92,17,52,38, 6,75,18,80,89,14,34, 6,74, 0,11,74, 2, 2,25,15, 0,86,30,96, 0,40, 0,10, 52, 0,
		    34,82, 6,39,49,91,50,47,66,54,40,78,59,86,71,59,55,38,81,95, 0,61, 9,31, 1,34,75, 0,31,86,31, 0, 9, 0,72, 57};
		for(int a, i = 0; i < v.length(); i++){
			a = v.charAt(i);
			if(sz < 0){
				a = Integer.decode(v);
				v = "";
				sz*=-1;
			}else if(a > 64 && a < 91)
				a = l[(a-65)+11]*100*100+l[(a-65)+11+37]*100+l[(a-65)+11+74];
			else if(a > 47 && a < 59)  
				a = l[(a-48)]*100*100+l[(a-48)+37]*100+l[(a-48)+74];
			for(int j = 0; j < 32; j++)
				if((int)((a >>> j) & 0x1) == 1 && a > 46)
					g.fill3DRect((px+i*(sz*4+sz/4))+(j%4)*sz, py+(j/4)*sz, sz, sz, true);
		}		
	}
	
	@Override
    protected void processMouseEvent(MouseEvent e) {
        mx = e.getX();
        my = e.getY();
        mb[3] = e.isControlDown();
        mb[e.getButton()] = (e.getID() == MouseEvent.MOUSE_PRESSED);      
    }
	
	 // to run in window, uncomment below
    public static void main(String[] args) throws Throwable {
        javax.swing.JFrame frame = new javax.swing.JFrame("Ringvibe");
        frame.setDefaultCloseOperation(javax.swing.JFrame.EXIT_ON_CLOSE);
        b applet = new b();
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
