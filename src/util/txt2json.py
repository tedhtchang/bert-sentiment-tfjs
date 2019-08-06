# -*- coding: utf-8 -*-
# python 2

import json
import re

txt_vocab = "../../public/vocab.txt"
json_vocab = "../../public/vocab.json"
vocab_list = []
indx=0
with open(txt_vocab) as fp:
  for line in fp:
    line = line.rstrip('\n')
    if re.search('\[.+\]', line):
      length = 1
    else:
      length = len(line)
      if line[0:2] == "##":
        line = line[2:]
        length -= 2
      else:
        lb = u'\u2581'.encode('utf-8','strict')
        line =  lb + line

    vocab_list.append([line, -(1.0/length), indx])
    indx += 1

print(json.dumps(vocab_list))
json_file = open(json_vocab, 'w')
json.dump(vocab_list, json_file, ensure_ascii=False)
