local bit = require("bit")

testLine = 'Combination 1: <span class="gray">0  0  0 (off, off, off)</span>'

GRAY = 0
WHITE = 1

grayHead = '<span class="gray">'
whiteHead = '<span class="white">'
foot = '</span>'

local newBitPattern = function (i)
  local bitPattern = ""
  local j = 7
  while j >= 0 do
    local n = i - 1
    n = bit.band(n, math.pow(2, j))
    n = bit.rshift(n, j)
    bitPattern = bitPattern .. n
    j = j - 1
  end
  return bitPattern
end

for i = 1, 256 do
  local line = whiteHead .. 'Combination '
  if i < 10 then
    line = line .. '  '
  elseif i < 100 then
    line = line .. ' '
  end
  line = line .. i .. ':'
  local bitPattern = newBitPattern(i);
  local state = {
    color = WHITE,
  }
  for i = 1, #bitPattern do
    local bit = string.sub(bitPattern, i, i)
    if bit == '0' then
      if state.color == WHITE then
        line = line .. foot
        line = line .. grayHead
        state.color = GRAY
      end
    end
    if bit == '1' then
      if state.color == GRAY then
        line = line .. foot
        line = line .. whiteHead
        state.color = WHITE
      end
    end
    if i == 5 then
      line = line .. whiteHead .. ' - ' .. foot .. bit
    else
      line = line .. '  ' .. bit
    end

  end
  line = line .. foot
  print(line)
end
