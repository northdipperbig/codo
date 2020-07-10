<template>
  <div>
  <Row :gutter="20">
    <!-- <i-col :md="24" :lg="5" style="margin-bottom: 20px;">
      <Card>
        <Tree ref="tree" :data="tagTreeData"  @on-select-change="handlerTreeChange" getSelectedNodes></Tree>
      </Card>
    </i-col>
    <i-col :md="24" :lg="19" style="margin-bottom: 20px;"> -->
      <Card shadow>
        <div class="search-con search-con-top">
          <Select v-model="searchKey" class="search-col">
            <Option v-for="item in columns2"
                    v-if="item.key == 'pro_name'"
                    :key="item.key"
                    :value="item.key">
              {{ item.title }}
            </Option>
          </Select>
          <Input @on-change="handleClear"
                 clearable
                 placeholder="输入关键字搜索"
                 class="search-input"
                 v-model="searchValue" />
          <Button @click="handleSearch"
                  class="search-btn"
                  type="primary">
            搜索
          </Button>
          <slot name="new_btn">
            <Button type="primary"
                    @click="handlerPrivate('', 'post', '添加域名商账户')"
                    class="search-btn">
              添加域名商账户
            </Button>
          </slot>
          <slot name="new_btn1"><Button type="success" :loading="loading2" @click="handleUpdateDomain()" class="search-btn">更新域名</Button></slot>
          <Button type="error" class="search-btn" @click="handlerDelete">批量删除</Button>
        </div>

        <Table
        size="small"
        ref="selection"
        border
        :columns="columns2"
        :data="tableData"
        @on-selection-change="handleSelectChange"
         ></Table>

        <div style="margin: 10px; overflow: hidden">
          <div style="float: left;">
              <Page :total="pageTotal" :current="pageNum" :page-size="pageSize" :page-size-opts=[15,35,50,100] show-sizer show-total @on-change="changePage" @on-page-size-change="handlePageSize">
              </Page>
          </div>
        </div>
      </Card>
    <!-- </i-col> -->
  </Row>
    <Modal v-model="modalMap2.modalVisible"  :title="modalMap2.modalTitle" :loading=true :footer-hide=true width="540" :mask-closable=false>
      <Form ref="formValidate2" :model="formValidate2" :rules="ruleValidate2" :label-width="150">
        <!-- <alert>温馨提示：只有描述可以不填</alert> -->
        <FormItem label="账户名称" prop="pro_name">
          <i-input v-model="formValidate2.pro_name" :maxlength="50" placeholder='请输入账户名称'></i-input>
        </FormItem>
        <FormItem label="域名厂商" prop="pro_platform">
          <Select class="search-input-long" v-model="formValidate2.pro_platform" filterable placeholder="请选择厂商">
            <Option v-for="item in platformlist" :value="item.id" :key="item.id">{{ item.value }}</Option>
          </Select>
        </FormItem>
        <FormItem label="账户类型" prop="pro_type">
          <Select class="search-input-long" v-model="formValidate2.pro_type" filterable placeholder="请选择账户类型">
            <Option v-for="item in privatetype" :value="item.id" :key="item.id">{{ item.value }}</Option>
          </Select>
        </FormItem>
        <FormItem label="登录用户" prop="pro_user">
          <i-input v-model="formValidate2.pro_user" :maxlength="100" placeholder='请输入登录用户'></i-input>
        </FormItem>
        <FormItem label="登录密码" prop="pro_password">
          <i-input v-model="formValidate2.pro_password" :maxlength="50" placeholder='请输入登录密码'></i-input>
        </FormItem>
        <FormItem label="API TOKEN" prop="pro_api_token">
          <i-input v-model="formValidate2.pro_api_token" :maxlength="50" placeholder='请输入API TOKEN'></i-input>
        </FormItem>
        <FormItem label="API KEY OR ID" prop="pro_api_key">
          <i-input v-model="formValidate2.pro_api_key" :maxlength="255" placeholder='请输入API KEY or ID'></i-input>
        </FormItem>
        <FormItem label="AccessSecret KEY" prop="pro_api_secret">
          <i-input v-model="formValidate2.pro_api_secret" :maxlength="255" placeholder='请输入API SECRET KEY'></i-input>
        </FormItem>
        <FormItem label="描述" prop="pro_remarks">
          <i-input v-model="formValidate2.pro_remarks" :maxlength="255" placeholder='请输入描述'></i-input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmitPrivate('formValidate2')">提交</Button>
          <Button @click="handleReset('formValidate2')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { getprivatelist, operationprivate, handleUpdatedomain } from '@/api/dnsprivate'

export default {
  data () {
    return {
      // 分页
      loading2: false,
      ruleLoading: false,
      ruleModal: false,
      pageTotal: 0, // 数据总数
      pageNum: 1, // 当前页码
      pageSize: 15, // 每页条数
      selectTwo: 'tag',
      selectTag: null,
      tagTreeData: [],
      searchVal: '',
      modalMap2: {
        modalVisible: false,
        modalTitle: '新建账户'
      },
      editModalData: null,
      tableData: [],
      tableDataTagrule: [],
      tableDataServer: [],
      tableDataDB: [],
      //
      platformlist: [{ id: 'name', value: 'Name' }, { id: 'godaddy', value: '狗爹' }, { id: 'dnspod', value: 'DNSPOD' }],
      privatetype: [{ id: 0, value: '全部' }, { id: 1, value: '仅购买' }, { id: 2, value: '仅解析' }],
      tableSelectIdList: [],
      //
      searchKey: '',
      searchValue: '',
      formValidate2: {
        id: null,
        pro_name: '',
        pro_platform: 'godaddy',
        pro_type: 0,
        pro_user: '',
        pro_password: '',
        pro_api_token: '',
        pro_api_key: '',
        pro_api_secret: '',
        pro_remarks: ''
      },
      formValidateTagrule: {
        id: null,
        name: '',
        idc_rule: '',
        hostname_rule: '',
        tag_name: ''
      },
      ruleValidate2: {
        pro_platform: [{requred: true, message: '域名平台不能为空', tigger: 'blur'}],
        pro_name: [{required: true, message: '账户名称不能为空', trigger: 'blur'}],
        pro_type: [{required: true, type: 'number', message: '请选择账户类型', trigger: 'blur'}]
      },

      columns2: [
        {type: 'selection', key: 'id', width: 80, align: 'center'},
        {title: '账户名称', key: 'pro_name', align: 'center'},
        {title: '域名平台', key: 'plat_name', align: 'center'},
        {title: '账户类型', key: 'type_name', align: 'center'},
        {title: '登录用户', key: 'pro_user', align: 'center'},
        {title: '登录密码', key: 'pro_password', align: 'center'},
        {title: 'API TOKEN', key: 'pro_api_token', align: 'center'},
        {title: 'API KEY(ID)', key: 'pro_api_key', align: 'center'},
        {title: 'API SECRET', key: 'pro_api_secret', align: 'center'},
        {title: '描述', key: 'pro_remarks', align: 'center'},
        {title: '操作',
          key: 'handle',
          width: 140,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button',
                {
                  props: {
                    type: 'success',
                    size: 'small'
                  },
                  style: {
                    marginRight: '2px'
                  },
                  on: {
                    click: () => {
                      this.handlerPrivate(params.row, 'put', '更新账户')
                    }
                  }
                },
                '更新'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.handlerDeletePrivate(params)
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ]
    }
  },
  methods: {
    getPrivateList (key, value) {
      getprivatelist(this.pageNum, this.pageSize, key, value).then(res => {
        if (res.data.code === 0) {
          this.privatetype.forEach(function (v) {
            res.data.data.forEach(function (v1) {
              if (v1.pro_type === v.id) {
                v1.type_name = v.value
              }
            })
          })
          this.platformlist.forEach(function (v) {
            res.data.data.forEach(function (v1) {
              if (v1.pro_platform === v.id) {
                v1.plat_name = v.value
              }
            })
          })
          this.tableData = res.data.data
          this.pageTotal = res.data.count
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    // 操作供应商账户
    handlerPrivate (paramsRow, meth, mtitle) {
      this.modalMap2.modalVisible = true
      this.modalMap2.modalTitle = mtitle
      this.editModalData = meth
      //
      // this.getLinksGroupList()
      if (paramsRow && paramsRow.id) {
        this.formValidate2 = {
          id: paramsRow.id,
          pro_name: paramsRow.pro_name,
          pro_platform: paramsRow.pro_platform,
          pro_type: paramsRow.pro_type,
          pro_user: paramsRow.pro_user,
          pro_password: paramsRow.pro_password,
          pro_api_token: paramsRow.pro_api_token,
          pro_api_key: paramsRow.pro_api_key,
          pro_api_secret: paramsRow.pro_api_secret,
          pro_remarks: paramsRow.pro_remarks
        }
      } else {
        this.formValidate2 = {
          id: null,
          pro_name: '',
          pro_platform: 'godaddy',
          pro_type: 0,
          pro_user: '',
          pro_password: '',
          pro_api_token: '',
          pro_api_key: '',
          pro_api_secret: '',
          pro_remarks: ''
        }
      }
    },
    handleUpdateDomain () {
      this.loading2 = true
      this.$Modal.confirm({
        title: '更新域名',
        content: '<p>拉取所有账户下域名到本地DNS库</p>',
        loading: true,
        onOk: () => {
          setTimeout(() => {
            this.$Modal.remove()
            handleUpdatedomain().then(res => {
              if (res.data.code === 0) {
                this.$Message.success(`${res.data.msg}`)
              } else {
                this.$Message.error(`${res.data.msg}`)
              }
              this.loading2 = false
            })
          }, 3000)
        },
        onCancel: () => {
          this.loading2 = false
          this.$Message.info('Clicked cancel')
        }
      })
    },
    closeTagModal () {
      // 关闭modal
      this.modalMap2.modalVisible = false
    },
    handlerDelete () {
      // console.log('长度',this.tableSelectIdList.length)
      if (this.tableSelectIdList.length > 3) {
        this.$Message.error(`批量删除最多三个`)
        return
      }
      if (this.tableSelectIdList.length > 0) {
        if (this.selectTwo === 'tag') {
          if (confirm(`确定要批量删除选中的标签`)) {
            operationprivate({ 'id_list': this.tableSelectIdList }, 'delete').then(
              res => {
                if (res.data.code === 0) {
                  this.$Message.success(`${res.data.msg}`)
                  this.getPrivateList('pro_name', this.searchVal)
                } else {
                  this.$Message.error(`${res.data.msg}`)
                }
              })
          }
        }
      } else {
        this.$Message.info(`你总要选中点什么吧`)
      }
    },
    handlerDeletePrivate (params) {
      if (confirm(`确定要删除标签 ${params.row.pro_name}`)) {
        operationprivate({ id: params.row.id }, 'delete').then(
          res => {
            if (res.data.code === 0) {
              this.$Message.success(`${res.data.msg}`)
              this.getPrivateList('pro_name', this.searchVal)
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          })
      }
    },
    handleSubmitPrivate (value) {
      this.$refs[value].validate((valid) => {
        if (valid) {
          setTimeout(() => {
            operationprivate(this.formValidate2, this.editModalData).then(
              res => {
                if (res.data.code === 0) {
                  this.$Message.success(`${res.data.msg}`)
                  this.getPrivateList('pro_name', this.searchVal)
                  // this.getTagTree()
                  this.modalMap2.modalVisible = false
                } else {
                  this.$Message.error(`${res.data.msg}`)
                }
              }
            )
          }, 1000)
        } else {
          this.$Message.error('表单校验错误')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    // 翻页
    changePage (value) {
      this.pageNum = value
      this.getPrivateList()
    },
    // 切换分页
    handlePageSize (value) {
      this.pageSize = value
      this.pageNum = 1
      this.getPrivateList()
    },
    handleClear (e) {
      if (e.target.value === '') this.tableData = this.value
      this.getPrivateList()
    },
    handleSearch () {
      this.getPrivateList(this.searchKey, this.searchValue)
    },
    // table 选中的ID
    handleSelectChange (val) {
      let SelectIdList = []
      val.forEach(item => {
        SelectIdList.push(item.id)
      })
      this.tableSelectIdList = SelectIdList
    }
  },
  watch: {
    // searchVal (val) {
    //   this.searchVal = val
    //   if(this.selectTwo === 'tag'){
    //     this.getTagList('tag_name', this.searchVal)
    //   }else if(this.selectTwo === 'DB'){
    //     this.getDBList(this.searchVal)
    //   }else if(this.selectTwo === 'server'){
    //     this.getServerList(this.searchVal)
    //   }
    // }
  },
  mounted () {
    // this.getTagTree()
    this.getPrivateList()
  }
}
</script>
<style lang='less' scoped>
  .search-con {
    padding: 10px 0;
    .search {
      &-col {
        display: inline-block;
        width: 160px;
      }
      &-input {
        display: inline-block;
        width: 250px;
        margin-left: 1px;
      }
      &-input-long {
        display: inline-block;
        width: 480px;
        margin-left: 1px;
      }
      &-btn {
        margin-left: 2px;
      }
    }
  }
</style>
