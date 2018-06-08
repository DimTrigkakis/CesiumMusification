import os

with open("output.js", "w", newline='') as a:
    a.write("var buildings = [\n")
    for path, subdirs, files in os.walk('C:\\Users\\Jack\\PycharmProjects\\CesiumMusification\\Apps\\CompleteData\\'):
       for filename in files:
         if not 'tilesetMod' in filename:
             continue
         f = os.path.join(path, filename)
         f = f.replace('C:\\Users\\Jack\\PycharmProjects\\CesiumMusification\\Apps\\', '\'./')
         f = f.replace('\\', '/')  
         f = f + '\','
         a.write(str(f) + os.linesep)
         print(str(f)+os.linesep)
    a.write("]")
