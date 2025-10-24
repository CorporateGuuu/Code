import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const DateTimePicker = ({ value, onChange, mode = 'date', display = 'spinner' }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [tempValue, setTempValue] = useState(value || new Date());

  const handleConfirm = () => {
    onChange && onChange(tempValue);
    setShowPicker(false);
  };

  const handleCancel = () => {
    setTempValue(value || new Date());
    setShowPicker(false);
  };

  const renderDatePicker = () => {
    // Simple implementation with buttons to increment/decrement
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 20 }}>
        <View>
          <Text>Month</Text>
          <TouchableOpacity onPress={() => setTempValue(new Date(tempValue.getTime() + 30 * 24 * 60 * 60 * 1000))}><Text>+</Text></TouchableOpacity>
          <Text>{tempValue.getMonth() + 1}</Text>
          <TouchableOpacity onPress={() => setTempValue(new Date(tempValue.getTime() - 30 * 24 * 60 * 60 * 1000))}><Text>-</Text></TouchableOpacity>
        </View>
        <View>
          <Text>Day</Text>
          <TouchableOpacity onPress={() => setTempValue(new Date(tempValue.getTime() + 24 * 60 * 60 * 1000))}><Text>+</Text></TouchableOpacity>
          <Text>{tempValue.getDate()}</Text>
          <TouchableOpacity onPress={() => setTempValue(new Date(tempValue.getTime() - 24 * 60 * 60 * 1000))}><Text>-</Text></TouchableOpacity>
        </View>
        <View>
          <Text>Year</Text>
          <TouchableOpacity onPress={() => setTempValue(new Date(tempValue.getTime() + 365 * 24 * 60 * 60 * 1000))}><Text>+</Text></TouchableOpacity>
          <Text>{tempValue.getFullYear()}</Text>
          <TouchableOpacity onPress={() => setTempValue(new Date(tempValue.getTime() - 365 * 24 * 60 * 60 * 1000))}><Text>-</Text></TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderTimePicker = () => {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 20 }}>
        <View>
          <Text>Hour</Text>
          <TouchableOpacity onPress={() => setTempValue(new Date(tempValue.getTime() + 60 * 60 * 1000))}><Text>+</Text></TouchableOpacity>
          <Text>{tempValue.getHours()}</Text>
          <TouchableOpacity onPress={() => setTempValue(new Date(tempValue.getTime() - 60 * 60 * 1000))}><Text>-</Text></TouchableOpacity>
        </View>
        <View>
          <Text>Minute</Text>
          <TouchableOpacity onPress={() => setTempValue(new Date(tempValue.getTime() + 60 * 1000))}><Text>+</Text></TouchableOpacity>
          <Text>{tempValue.getMinutes()}</Text>
          <TouchableOpacity onPress={() => setTempValue(new Date(tempValue.getTime() - 60 * 1000))}><Text>-</Text></TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderDatetimePicker = () => {
    return (
      <View>
        {renderDatePicker()}
        {renderTimePicker()}
      </View>
    );
  };

  const renderPickerContent = () => {
    switch (mode) {
      case 'date':
        return renderDatePicker();
      case 'time':
        return renderTimePicker();
      case 'datetime':
        return renderDatetimePicker();
      default:
        return renderDatePicker();
    }
  };

  const displayValue = value ? value.toLocaleString() : 'Select Date/Time';

  return (
    <>
      <TouchableOpacity onPress={() => setShowPicker(true)} style={{ borderWidth: 1, padding: 10, borderRadius: 5 }}>
        <Text>{displayValue}</Text>
      </TouchableOpacity>
      <Modal visible={showPicker} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20 }}>
            {renderPickerContent()}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              <TouchableOpacity onPress={handleCancel} style={{ padding: 10 }}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleConfirm} style={{ padding: 10 }}>
                <Text>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default DateTimePicker;
