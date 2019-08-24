import json
import re

txt_vocab = "../../public/vocab.txt"
json_vocab = "../../public/vocab.json"
vocab_list = []
index = 0
py2 = False
leb = u'\u2581' #lower one eighth block

#For runing in python2 environment
if isinstance(leb, str) == False:
  py2 = True
  leb = u'\u2581'.encode('utf-8','strict')

with open(txt_vocab) as fp:
  for vocab in fp:
    vocab = vocab.rstrip('\n')
    if re.search('\[.+\]', vocab):
      length = 1
      vocab = leb + vocab
    else:
      length = len(vocab.decode('utf-8')) if py2 else len(vocab)
      if vocab[0:2] == "##":
        vocab = vocab[2:]
        length -= 2
      else:
        vocab =  leb + vocab
    vocab_list.append([vocab, -(1.0/length), index])
    index += 1
# Need to add the "Lower one eighth block" to the vocab file for sentencepiece to work properly
vocab_list.append([leb, -1.0, index])
print(json.dumps(vocab_list, ensure_ascii = False))
json_file = open(json_vocab, 'w')
json.dump(vocab_list, json_file, ensure_ascii = False)
