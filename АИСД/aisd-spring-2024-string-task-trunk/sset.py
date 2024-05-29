#!/usr/bin/env python3

"""
Suffix tree to search in dictionary
"""

from typing import List


class SuffixTreeNode:
    def __init__(self):
        self.children = {}
        self.word_indices = set()

class SuffixTree:
    def __init__(self):
        self.root = SuffixTreeNode()

    def insert(self, word, index):
        for i in range(len(word)):
            current = self.root
            for char in word[i:]:
                if char not in current.children:
                    current.children[char] = SuffixTreeNode()
                current = current.children[char]
                current.word_indices.add(index)

    def search(self, substring):
        current = self.root
        for char in substring:
            if char not in current.children:
                return set()
            current = current.children[char]
        return current.word_indices

class SSet:
    def __init__(self, filename):
        self.filename = filename
        self.words = []
        self.suffix_tree = SuffixTree()

    def load(self):
        with open(self.filename, 'r') as file:
            for index, line in enumerate(file):
                word = line.strip()
                if word:  # Избегаем пустых строк
                    self.words.append(word)
                    self.suffix_tree.insert(word, index)

    def search(self, substring):
        indices = self.suffix_tree.search(substring)
        return [self.words[i] for i in indices]

# Пример использования
# sset = SSet('small-words.txt')
# sset.load()
# print(sset.search('ab'))
