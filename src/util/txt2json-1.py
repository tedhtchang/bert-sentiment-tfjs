import json
import re

txt_vocab = "../../public/vocab.txt"
json_vocab = "../../public/vocab-1.json"
vocab_list = []
cnt=0
with open(txt_vocab) as fp:
  for line in fp:
    if line[0:2] == "##":
      line = line[2:]
    else:
      line = "_" + line
    line = line.rstrip('\n')
    if re.search('\[.+\]', line):
      length = 1
    else:
      length = len(line)
    vocab_list.append([line, -(1.0/length), cnt])
    cnt += 1

print(json.dumps(vocab_list, ensure_ascii=False))
json_file = open(json_vocab, 'w')
json.dump(vocab_list, json_file, ensure_ascii=True)
