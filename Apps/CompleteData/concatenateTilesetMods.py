import os, re

def getSubdirs(path):
   subdirs = path.replace(cwd, '')
   subdirs = subdirs.replace('\\', '/')
   subdirs = subdirs+'/data/'
   if(subdirs[0] == '/'):
      subdirs = subdirs[1:]
   return subdirs

def createFinalstr(a, path):
   startpattern = '}\s+}$'

   c = re.sub(startpattern, '', a)
   subdirs = getSubdirs(path)
   print(subdirs)
   c = c.replace('data/', subdirs)
   c = c.rstrip()
   t = ',"children" : [ \n'
   c = c+t
   return c

def concatenate(a,cwd, path, finalstr):
   
   '''pattern other tiles'''
   pattern = '"root"\s+:\s+({[\S\s]*)}'
   subdirs = getSubdirs(path)
   print(subdirs)
   
   m = re.search(pattern, a)
   if (m):
      c = m.group(1)
      #print(c)
   
   c = c.replace('data/', subdirs)
   c = ',' + c
   finalstr = finalstr + c +'\n'
   
   return finalstr
   
finalstr = ''
ctr = 0
cwd = os.getcwd()
for path, subdirs, files in os.walk(os.getcwd()):
 for filename in files:
   f = os.path.join(path, filename)
   if '\\Building\\tileset.json' in f:
      with open(f, 'r') as content_file:
         print("Reading ", f)
         content = content_file.read()
         if (finalstr == ''):
            print("creating fstr")
            finalstr = createFinalstr(content, path)
         finalstr = concatenate(content, cwd, path, finalstr)
         ctr += 1

finalstr = re.sub('\[\s+,{', '[\n{', finalstr)
finalstr = re.sub('\s+\],"children"\s+:\s+\[', ',', finalstr)
finalstr = finalstr + "\t\t]\n\t}\n}"
newpath = cwd + '\\tilesetColl-novol.json'
tf = open(newpath, 'w+')
print(ctr, "files processed" )
tf.write(finalstr)
tf.close()
