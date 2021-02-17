import tensorflow as tf
import os
import sys

cwd = os.getcwd()
print(cwd)

arr = sys.argv[1].split(',')
arr = list(map(float, arr))

model1 = tf.keras.models.load_model('ada_model.h5')

y_pred12 = model1.predict([arr] )

#print('''{"inf": ''' + stry_pred12[0][1], "sup": y_pred12[0][0] }''')
json = '{"inf": %f, "sup": %f}' % (y_pred12[0][0],y_pred12[0][1])
print(json)
print(arr)
