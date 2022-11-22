import { Modal, Form, Upload, Input, Radio, Space } from 'antd';
export default function AddNew({ setShowAddNew }) {

  const handleSubmit = (values) => {
    console.log({ values })
  }

  return (
    <>
      <Modal
        title="Add New Item"
        open={true}
        footer={null}
        onCancel={() => setShowAddNew(false)}>
        <Form onFinish={handleSubmit} layout='vertical'>
          <Form.Item
            name="image"
          >
            <Upload listType="picture-card"
              maxCount={1}>
              Upload an Image
            </Upload>
          </Form.Item>

          <Form.Item
            name="productName"
            label="Product Name"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="brand"
            label="Brand"
          >
            <Input />
          </Form.Item>

          <Form.Item label='When do you want to restock?'>
            <Radio.Group name="type" value={"stockable"} >
              <Space direction="vertical">
                <Radio value={"stockable"}>When my shelf is almost empty.</Radio>
                <Radio value={"consumable"}>When the container is running low.</Radio>
                <Radio value={"perishable"}>Before a certain date.</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>

          <Form.Item>
            <Input type='submit' value='Save' />
          </Form.Item>
        </Form>

      </Modal>
    </>
  )
}