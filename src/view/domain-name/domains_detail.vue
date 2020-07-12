<template>
<Modal width="800px;" v-model="dialog.show"  :title="dialog.title" :loading=true :footer-hide=true>
    <Card dis-hover>
      <div class="inner" >
        <!-- <Alert show-icon>基本信息</Alert> -->
        <div style="margin-top:10px;margin-bottom:10px">
            <Row>
                <Col span="4"><p> <b>域名：</b> </p></Col>
                <Col span="20"><p> {{formData.domain_name}} ({{formData.id}}) </p></Col>
            </Row>
            <Row>
                <Col span="4"><p> <b>平台账户：</b> </p></Col>
                <Col span="20"><p> {{formData.plat_name}} ({{formData.plat_id}})</p></Col>
            </Row>
            <Row>
                <Col span="4"><p> <b>购买时间：</b> </p></Col>
                <Col span="20"><p> <Tag color="blue">{{formData.create_time}}</tag> </p></Col>
            </Row>
            <Row>
                <Col span="4"><p> <b>续费到期时间：</b> </p></Col>
                <Col span="20"><p> <Tag color="blue">{{formData.expired_time}}</tag></p></Col>
            </Row>
            <Row>
                <Col span="4"><p> <b>域名状态：</b> </p></Col>
                <Col span="20"><p> <Tag color="blue">{{formData.domain_status}}</tag> </p></Col>
            </Row>
            <Row>
                <Col span="4"><p> <b>平台锁定</b>  </p></Col>
                <Col span="8"><p v-if="formData.domain_locked == 1"> 是 </p><p v-else> 否 </p></Col>
                <Col span="4"><p> <b>自动续费</b>  </p></Col>
                <Col span="8"><p v-if="formData.auto_renew == 1"> 是 </p><p v-else> 否 </p></Col>
            </Row>
            <Row>
                <Col span="4"><p> <b>NS服务器一</b>  </p></Col>
                <Col span="20"><p> {{formData.domain_ns1}} </p></Col>
            </Row>
            <Row>
                <Col span="4"><p> <b>NS服务器二</b>  </p></Col>
                <Col span="8"><p> {{formData.domain_ns2}} </p></Col>
            </Row>
            <Row>
                <Col span="4"><p> <b>SSL证书到期：</b>  </p></Col>
                <Col span="20">
                    <p v-if="formData.ssl_cert_expired_days < 30"> <Tag color="red"> {{formData.ssl_cert_expired_time}} </Tag></p>
                    <p v-else-if="formData.ssl_cert_expired_days <= 0"> {{formData.ssl_cert_expired_time}} </p>
                    <p v-else> <Tag color="blue"> {{formData.ssl_cert_expired_time}} </Tag></p>
                </Col>
            </Row>
        </div>
      </div>
    </Card>
</Modal>

</template>
<script>
export default {
  name: 'detail',
  props: {
    dialog: Object,
    formData: Object
  }
}
</script>
