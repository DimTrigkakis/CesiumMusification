import os, re


def replace(a,path):
   newpath = path + '\\tilesetMod.json'
   pattern = '"root"\s+:\s+\{\s+"boundingVolume"\s+:\s+\{\s+"box"\s+:\s+(\[.*\])\s+},'
   valpattern = '(\[.*\])'
   m = re.search(pattern, a)
   if m:
      print("Found substring")
      found = m.group(0)
      vals = m.group(1)
   else:
      found = ''
   print("Replacing...")
   newstr = found.replace("boundingVolume", "viewerRequestVolume")
   newstr = newstr.replace('"root" : {', '')
   valarray = vals.split()   
   newvals = '['+ valarray[1] + valarray[2]+ valarray[3]+'500]'
   newstr = newstr.replace(vals, newvals)
   newstr = newstr.replace("box", "sphere")
   finalstr = a.replace(found, found+newstr)
   print("Writing to ",newpath)
   tf = open(newpath, 'w+')
   tf.write(finalstr)
   tf.close()
   
   
for path, subdirs, files in os.walk(os.getcwd()):
 for filename in files:
   f = os.path.join(path, filename)
   if 'tileset.json' in f:
      with open(f, 'r') as content_file:
         print("Reading ", f)
         content = content_file.read()
         if "viewerRequestVolume" not in content:
            print("Modifying ", f)
            replace(content, path)

