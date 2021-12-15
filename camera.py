from picamera import PiCamera
from time import sleep

camera = PiCamera()
camera.rotation = 180
camera.start_preview()
#sleep(10)
#camera.capture('/home/pi/Desktop/image.jpg')
for i in range(5):
    sleep(5)
camera.capture('/home/pi/Desktop/image%s.jpg' % i)
camera.stop_preview()
