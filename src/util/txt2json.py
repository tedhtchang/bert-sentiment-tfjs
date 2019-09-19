import argparse
import json
import re

def convert_to_sp(txt_vocab, json_vocab, verbose):
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
  write_to_file(vocab_list, json_vocab)
  if verbose:
    verbose_print(vocab_list)

def write_to_file(vocab_list, json_vocab):
  json_file = open(json_vocab, 'w')
  json.dump(vocab_list, json_file, ensure_ascii = False)

def verbose_print(vocab_list):
  print(json.dumps(vocab_list, ensure_ascii = False))
  print("Conversion finished!")

if __name__ == '__main__':
  parser = argparse.ArgumentParser(description='Convert Wordpiece vocab.txt to Sentencepiece vocab.json')
  parser.add_argument('wptxt', type=str, nargs=1,
                      help='Path to the Wordpiece vocab.txt')
  parser.add_argument('spjson', type=str, nargs=1,
                      help='Path to save the converted Sentencepiece vocab.json')
  parser.add_argument('--verbose', '-v', action='store_true', default=False)
  args = parser.parse_args()
  convert_to_sp(args.wptxt[0], args.spjson[0], args.verbose)
