
int[] color = {96, 81, 89};
int[] angles = {0, 0, 0};

void setup() {
  size(500,500,P3D);
}

void draw()
{
    background(206, 222, 218);
    lights();

    fill(color[0], color[1], color[2]);
    pushMatrix();
    translate( width/2, height/2, 0 );
    rotateX( radians(angles[0]) );
    rotateY( radians(angles[1]) );
    rotateZ( radians(angles[2]) );
    drawRocket(250);
    popMatrix();
}

void setAngles(int x, int y, int z)
{
  angles[0] = x;
  angles[1] = y;
  angles[2] = z;
}

void drawCylinder( int sides, float r1, float r2, float h)
{
    float angle = 360 / sides;
    float halfHeight = h / 2;
    stroke(0, 0, 0);
    // top
    beginShape();
    for (int i = 0; i < sides; i++) {
        float x = cos( radians( i * angle ) ) * r1;
        float y = sin( radians( i * angle ) ) * r1;
        vertex( x, y, -halfHeight);
    }
    endShape(CLOSE);
    // bottom
    beginShape();
    for (int i = 0; i < sides; i++) {
        float x = cos( radians( i * angle ) ) * r2;
        float y = sin( radians( i * angle ) ) * r2;
        vertex( x, y, halfHeight);
    }
    endShape(CLOSE);
    // draw body
    stroke(color[0], color[1], color[2]);
    beginShape(TRIANGLE_STRIP);
    for (int i = 0; i < sides + 1; i++) {
        float x1 = cos( radians( i * angle ) ) * r1;
        float y1 = sin( radians( i * angle ) ) * r1;
        float x2 = cos( radians( i * angle ) ) * r2;
        float y2 = sin( radians( i * angle ) ) * r2;
        vertex( x1, y1, -halfHeight);
        vertex( x2, y2, halfHeight);
    }
    endShape(CLOSE);
} 

void drawRocket(float height)
{

  drawCylinder(20, 20, 20, height);
  translate( 0, 0, height / 2 + 25 );
  drawCylinder(20, 20, .5, 50);
  translate( 0, 0, -height - 25 );
  drawCylinder(20, 20, .5, 50);
  stroke(0);
  rotateX(PI/2);
  triangle(0,0, 70, 0, 0, 100);
  rotateY(2*PI/3);
  triangle(0,0, 70, 0, 0, 100);
  rotateY(2*PI/3);
  triangle(0,0, 70, 0, 0, 100);


}
